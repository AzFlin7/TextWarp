using Microsoft.AspNetCore.Mvc;
using System.Data;
using TextWarp.Models.Database;
using TextWarp.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Policy;
using System.Linq;
using TextWarp.Services;

namespace TextWarp.Controllers
{
    public class GalleryController : Controller
    {
        cfcreatorContext _context;

        public GalleryController(cfcreatorContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            return View();
        }

        [Route("gallery/getData")]
        [HttpGet]
        public ActionResult getData(string name = "", int index = 1, int count = 30)
        {
            var query = _context.WarpedSvgs.Where(s => s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d");
            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(s => s.WorkName.Contains(name));
            }
            int start = (index - 1) * count;
            var savedSvgs = query.OrderByDescending(s => s.UpdatedAt).Skip(start).Take(count).ToList();
            return Json(new { status = "success", savedSvgs = savedSvgs, msg = "" });
        }

        [Route("gallery/rename")]
        [HttpPost]
        public ActionResult Rename(RenameModel data)
        {
            try
            {
                var selectedSvg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.MediaId == data.MediaId)).FirstOrDefault();
                if(selectedSvg != null && data.Name != null)
                {
                    selectedSvg.WorkName = data.Name;
                    _context.WarpedSvgs.Update(selectedSvg);
                    _context.SaveChanges();
                    return Json(new { status = "success",msg = "" });
                }
                else
                {
                    return Json(new { status = "failed", msg = "Bad request." });
                }
            }
            catch (Exception e)
            {
                return Json(new { status = "failed", msg = e.Message });
            }
        }

        [Route("gallery/duplicate")]
        [HttpGet]
        public ActionResult Duplicate(string mediaId = "", string query = "")
        {
            try
            {
                var selected_svg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.MediaId == mediaId)).FirstOrDefault();

                if (selected_svg != null)
                {
                    string duplicatedSVGPath = "";
                    string fileName = Guid.NewGuid().ToString() + ".svg";
                    duplicatedSVGPath = "svgFiles/" +fileName ;
                    string displayPath = duplicatedSVGPath;
                    var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads");
                    duplicatedSVGPath = Path.Combine(filepath, duplicatedSVGPath);
                    var srcfilepath = Path.Combine(filepath, selected_svg.SvgfileName);
                    if (System.IO.File.Exists(srcfilepath) && !System.IO.File.Exists(duplicatedSVGPath))
                    {
                        System.IO.File.Copy(srcfilepath, duplicatedSVGPath);
                        var warpedSvg = new WarpedSvg();
                        warpedSvg.CreatedAt = DateTime.Now;
                        warpedSvg.UpdatedAt = DateTime.Now;
                        warpedSvg.SvgfileName = displayPath;
                        warpedSvg.MediaId = MediaIdHelper.generate("TW");
                        warpedSvg.UserId = "41ae9ea6-035a-4bc6-98f9-fd758422de6d";
                        warpedSvg.WorkName = selected_svg.WorkName;
                        warpedSvg.Words = selected_svg.Words;
                        warpedSvg.StyleIndex = selected_svg.StyleIndex;
                        _context.WarpedSvgs.Add(warpedSvg);
                        _context.SaveChanges();
                    }
                    return getData(query, 1, 30);
                }
                else return Json(new { status = "failed", savedSvgs = new List<WarpedSvg>(), msg = "Failed svg duplicate." });
            }
            catch(Exception e)
            {
                return Json(new { status = "failed", savedSvg = new List<WarpedSvg>(), msg = e.Message });
            }
        }

        [Route("gallery/delete")]
        [HttpGet]
        public ActionResult Delete(string mediaId = "")
        {
            try {
                if (!String.IsNullOrEmpty(mediaId))
                {
                    var selected_svg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.MediaId == mediaId)).FirstOrDefault();
                    var fileName = selected_svg.SvgfileName;
                    var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads");
                    fileName = Path.Combine(filepath, fileName);
                    if (System.IO.File.Exists(fileName))
                    {
                        try
                        {
                            System.IO.File.Delete(fileName);
                        }
                        catch (Exception e) { return Json(new { status = "failed", msg = e.Message }); }
                    }
                    _context.WarpedSvgs.Remove(selected_svg);
                    _context.SaveChanges();
                    return Json(new { status = "success", msg = "" });
                }
                else
                {
                    return Json( new {status = "failed", msg = "Bad request."});
                }
            }
            catch(Exception exp)
            {
                return Json(new { status = "failed", msg = exp.Message });
            }
        }
    }
}
