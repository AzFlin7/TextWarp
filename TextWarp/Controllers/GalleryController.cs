using Microsoft.AspNetCore.Mvc;
using System.Data;
using TextWarp.Models.Database;
using TextWarp.Models;
using Microsoft.AspNetCore.Authorization;

namespace TextWarp.Controllers
{
    public class GalleryController : Controller
    {
        cfcreatorContext _context;

        public GalleryController(cfcreatorContext context)
        {
            _context = context;
        }
        //[Authorize]
        public IActionResult Index()
        {
            var saved_svgs = _context.WarpedSvgs.Where(s => s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d").ToList();
            if (saved_svgs != null)
            {
                foreach (var saved_svg in saved_svgs)
                {
                    if(saved_svg.SvgfileName == "")
                    {
                        _context.WarpedSvgs.Remove(saved_svg);
                        _context.SaveChanges();
                    }
                }
                saved_svgs = _context.WarpedSvgs.Where(s => s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.SvgfileName != "").OrderByDescending(s=> s.UpdatedAt).ToList();
                return View(saved_svgs);
            }
            return View();
        }

        [Route("gallery/createNew/{words}/{styleIndex}")]
        [HttpGet]
        public ActionResult createNew(string words, int styleIndex)
        {
            var saved_svgs = _context.WarpedSvgs.Where(s => s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d").ToList();
            var name = "Untitled" + "_" + DateTime.Now;
            var WarpedSvgs = new WarpedSvg();
            WarpedSvgs.CreatedAt = DateTime.Now;
            WarpedSvgs.UpdatedAt = DateTime.Now;
            WarpedSvgs.Words = words;
            WarpedSvgs.StyleIndex = styleIndex;
            WarpedSvgs.SvgfileName = "";
            WarpedSvgs.WorkName = name;
            WarpedSvgs.UserId = "41ae9ea6-035a-4bc6-98f9-fd758422de6d";
            _context.WarpedSvgs.Add(WarpedSvgs);
            _context.SaveChanges();

            var savedSvg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.WorkName.Equals(name))).Single();

            return Json(new { status = "success", id = savedSvg.Id });
        }

        [Route("gallery/duplicate/{id?}")]
        [HttpGet]
        public ActionResult Duplicate(int id)
        {
            var selected_svg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();

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
                    warpedSvg.UserId = "41ae9ea6-035a-4bc6-98f9-fd758422de6d";
                    warpedSvg.WorkName = selected_svg.WorkName + "_copy";
                    warpedSvg.Words = selected_svg.Words;
                    warpedSvg.StyleIndex = selected_svg.StyleIndex;
                    _context.WarpedSvgs.Add(warpedSvg);
                    _context.SaveChanges();
                }
                
                var copiedSvg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.SvgfileName.Equals(displayPath))).Single();
                if (copiedSvg != null)
                {
                    return Json(new { status = "success", copiedSvg = copiedSvg });
                }
                else return Json(new { status = "failed" });
            }
            else return Json(new { status = "failed" });
        }

        [Route("gallery/delete/{id?}")]
        [HttpGet]
        public ActionResult Delete(int id)
        {
            var selected_svg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();
            var fileName = selected_svg.SvgfileName;
            var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads");
            fileName = Path.Combine(filepath, fileName);
            if (System.IO.File.Exists(fileName))
            {
                try { 
                    System.IO.File.Delete(fileName);
                    _context.WarpedSvgs.Remove(selected_svg);
                    _context.SaveChanges();

                    return Json(new { status = "success" });
                }
                catch (Exception e) { return Json(new { status = "failed", msg = e.Message }); }
            }
            else
            {
                return Json(new { status = "failed", msg = "File Not found!" });
            }
        }
    }
}
