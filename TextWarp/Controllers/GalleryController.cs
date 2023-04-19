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
        public IActionResult Index()
        {
            try
            {
                var saved_svgs = _context.WarpedSvgs.Where(s => s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d").ToList();
                if (saved_svgs != null)
                {
                    foreach (var saved_svg in saved_svgs)
                    {
                        if (saved_svg.SvgfileName == "")
                        {
                            _context.WarpedSvgs.Remove(saved_svg);
                            _context.SaveChanges();
                        }
                    }
                    saved_svgs = _context.WarpedSvgs.Where(s => s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.SvgfileName != "").OrderByDescending(s => s.UpdatedAt).ToList();
                    return View(saved_svgs);
                }
                return View();
            }
            catch(Exception e)
            {
                return View();
            }
        }

        [Route("gallery/createNew/{words}/{styleIndex}")]
        [HttpGet]
        public ActionResult createNew(string words, int styleIndex)
        {
            try
            {
                var saved_svgs = _context.WarpedSvgs.Where(s => s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d").ToList();
                var name = "Untitled" + "_" + DateTime.Now;
                var WarpedSvg = new WarpedSvg();
                WarpedSvg.CreatedAt = DateTime.Now;
                WarpedSvg.UpdatedAt = DateTime.Now;
                WarpedSvg.Words = words;
                WarpedSvg.StyleIndex = styleIndex;
                WarpedSvg.SvgfileName = "";
                WarpedSvg.WorkName = name;
                WarpedSvg.UserId = "41ae9ea6-035a-4bc6-98f9-fd758422de6d";
                WarpedSvg.Version = 0;
                _context.WarpedSvgs.Add(WarpedSvg);
                _context.SaveChanges();

                var savedSvg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.WorkName.Equals(name))).Single();

                return Json(new { status = "success", id = savedSvg.Id });
            }
            catch(Exception e)
            {
                return Json(new { status = "error", id = e.Message });
            }
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

        [Route("gallery/duplicate/{id?}")]
        [HttpGet]
        public ActionResult Duplicate(int id)
        {
            try
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
            catch(Exception e)
            {
                return Json(new { status = "failed" });
            }
        }

        [Route("gallery/delete/{id?}")]
        [HttpGet]
        public ActionResult Delete(int id)
        {
            try {
                var selected_svg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();
                var fileName = selected_svg.SvgfileName;
                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads");
                fileName = Path.Combine(filepath, fileName);
                if (System.IO.File.Exists(fileName))
                {
                    try
                    {
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
            catch(Exception exp)
            {
                return Json(new { status = "failed", msg = "Exception Raised." });
            }
        }
    }
}
