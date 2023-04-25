using Microsoft.AspNetCore.Mvc;
using System.Data;
using TextWarp.Models.Database;
using TextWarp.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Policy;
using System.Linq;

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

        [Route("gallery/getData/")]
        [HttpPost]
        public ActionResult getData(WorkSearchModel workSearchItem)
        {
            try
            {
                if(workSearchItem.WorkName != null)
                {
                    var saved_svgs = _context.WarpedSvgs.Where(s => s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.WorkName.Contains(workSearchItem.WorkName)).ToList();
                    if (saved_svgs != null) return Json(new { status = "success", saved_svgs = saved_svgs });
                    return Json(new { status = "success", msg = "There are no svgs." });
                }
                else
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
                        return Json(new { status = "success", saved_svgs = saved_svgs });
                    }
                    return Json(new { status = "success", msg = "There are no svgs." });
                }
            }
            catch (Exception e)
            {
                return Json(new { status = "fail", msg = e.ToString() });
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

        [Route("gallery/getWorkNameList")]
        public ActionResult getWorkNameList()
        {
            try
            {
                var workNames = _context.WarpedSvgs.Where(s => s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.SvgfileName != "").OrderBy(s => s.WorkName).Select(s => s.WorkName).ToList();
                return Json(new
                {
                    status = "success",
                    workNames = workNames
                }) ;
            }
            catch(Exception e)
            {
                return Json(new
                {
                    status = "failed"
                });
            }
        }
    }
}
