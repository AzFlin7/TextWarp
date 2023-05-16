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
            var query = _context.Twsvgs.Where(s => s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d");
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
                var selectedSvg = _context.Twsvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.MediaId == data.MediaId)).FirstOrDefault();
                if(selectedSvg != null && data.Name != null)
                {
                    selectedSvg.WorkName = data.Name;
                    _context.Twsvgs.Update(selectedSvg);
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
                var selected_svg = _context.Twsvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.MediaId == mediaId)).FirstOrDefault();

                if (selected_svg != null)
                {
                    string duplicatedSVGPath = "";
                    string _mediaId = MediaIdHelper.generate("TW");
                    string fileName = _mediaId + ".svg";
                    var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads\\svgs");
                    duplicatedSVGPath = Path.Combine(filepath, duplicatedSVGPath + fileName);
                    var srcfilepath = Path.Combine(filepath, selected_svg.MediaId + ".svg");
                    if (System.IO.File.Exists(srcfilepath) && !System.IO.File.Exists(duplicatedSVGPath))
                    {
                        System.IO.File.Copy(srcfilepath, duplicatedSVGPath);
                        var warpedSvg = new Twsvg();
                        warpedSvg.CreatedAt = DateTime.Now;
                        warpedSvg.UpdatedAt = DateTime.Now;
                        warpedSvg.MediaId = _mediaId;
                        warpedSvg.UserId = "41ae9ea6-035a-4bc6-98f9-fd758422de6d";
                        warpedSvg.WorkName = selected_svg.WorkName;
                        warpedSvg.Words = selected_svg.Words;
                        warpedSvg.StyleIndex = selected_svg.StyleIndex;
                        warpedSvg.Width = selected_svg.Width;
                        warpedSvg.Height = selected_svg.Height;
                        _context.Twsvgs.Add(warpedSvg);
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
                    Twsvg selected_svg = _context.Twsvgs.Where(s => s.MediaId == mediaId).FirstOrDefault();
                    if (selected_svg != null)
                    {
                        var fileName = mediaId + ".svg";
                        var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads\\svgs");
                        fileName = Path.Combine(filepath, fileName);
                        
                        SendToApparel sendToApparel = _context.SendToApparels.Where(s => s.MediaId == mediaId).FirstOrDefault();
                        if (sendToApparel != null) _context.SendToApparels.Remove(sendToApparel);

                        _context.Twsvgs.Remove(selected_svg);
                        _context.SaveChanges();

                        if (System.IO.File.Exists(fileName))
                        {
                            try
                            {
                                System.IO.File.Delete(fileName);
                            }
                            catch (Exception e) { return Json(new { status = "failed", msg = e.Message }); }
                        }
                        return Json(new { status = "success", msg = "" });
                    }
                }
                return Json( new {status = "failed", msg = "Bad request."});
            }
            catch(Exception exp)
            {
                return Json(new { status = "failed", msg = exp.Message });
            }
        }
    }
}
