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
        public ActionResult getData(string? name = "")
        {
            var query = _context.WarpedSvgs.Where(s => s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d");
            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(s => s.WorkName.Contains(name));
            }
            var saved_svgs = query.OrderByDescending(s => s.UpdatedAt).ToList();
            if (saved_svgs != null) return Json(new { status = "success", saved_svgs = saved_svgs, msg = "" });
            return Json(new { status = "success", saved_svgs = new List<WarpedSvg>(), msg = "There are no svgs." });
        }

        [Route("gallery/rename")]
        [HttpPost]
        public ActionResult Rename(RenameModel data)
        {
            var warpedSvgs = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.WorkName.Equals(data.Name))).ToList();
            if (warpedSvgs.Count > 0)
            {
                return Json(new { status = "duplicated" });
            }

            try
            {
                var selectedSvg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == data.Id)).Single();
                selectedSvg.WorkName = data.Name;
                _context.WarpedSvgs.Update(selectedSvg);
                _context.SaveChanges();
                return Json(new { status = "success" });
            }
            catch (Exception e)
            {
                return Json(new { status = "failed" });
            }
        }

        [Route("gallery/duplicate")]
        [HttpGet]
        public ActionResult Duplicate(string mediaId = "")
        {
            try
            {
                var selected_svg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.MediaId == mediaId)).FirstOrDefault();

                if (selected_svg != null)
                {
                    var duplicatedSVGPath = selected_svg.SvgfileName.Split("/")[1];
                    var displayPath = "";
                    duplicatedSVGPath = duplicatedSVGPath.Split(".")[0];
                    duplicatedSVGPath = duplicatedSVGPath + "_copy" + ".svg";
                    duplicatedSVGPath = "svgFiles/" + duplicatedSVGPath;
                    displayPath = duplicatedSVGPath;
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
                        warpedSvg.MediaId = MediaIdHelper.generate("WAPRTEXT");
                        warpedSvg.UserId = "41ae9ea6-035a-4bc6-98f9-fd758422de6d";
                        warpedSvg.WorkName = selected_svg.WorkName + "_copy";
                        warpedSvg.Words = selected_svg.Words;
                        warpedSvg.StyleIndex = selected_svg.StyleIndex;
                        _context.WarpedSvgs.Add(warpedSvg);
                        _context.SaveChanges();
                    }

                    var copiedSvg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.SvgfileName.Equals(displayPath))).FirstOrDefault();
                    if (copiedSvg != null)
                    {
                        return Json(new { status = "success", copiedSvg = copiedSvg, msg = "" });
                    }
                    else return Json(new { status = "failed", copiedSvg = new List<WarpedSvg>(), msg = "Failed svg duplicate." });
                }
                else return Json(new { status = "failed", copiedSvg = new List<WarpedSvg>(), msg = "Failed svg duplicate." });
            }
            catch(Exception e)
            {
                return Json(new { status = "failed", msg = e.Message });
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
