using Microsoft.AspNetCore.Mvc;
using System.Drawing;
using TextWarp.Models;
using TextWarp.Models.Database;

namespace TextWarp.Controllers
{
    public class WarpController : Controller
    {
        cfcreatorContext _context;
        public WarpController(cfcreatorContext context)
        {
            this._context = context;
        }

        [Route("warp/index/{id?}")]
        public IActionResult Index(int id)
        {
            try
            {
                var record = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();
                var SvgViewModel = new SVGViewModel();
                SvgViewModel.id = record.Id;
                SvgViewModel.words = record.Words;
                SvgViewModel.styleIndex = record.StyleIndex;
                return View(SvgViewModel);
            }
            catch(Exception e)
            {
                return View();
            }
        }

        [Route("warp/editor/{id?}")]
        public IActionResult Editor(int id)
        {
            try
            {
                var record = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();
                var SvgViewModel = new SVGViewModel();
                SvgViewModel.id = record.Id;
                SvgViewModel.words = record.Words;
                SvgViewModel.styleIndex = record.StyleIndex;
                if (record.SvgfileName != "")
                {
                    var svgImgPath = "uploads/" + record.SvgfileName+"?v="+record.Version;
                    SvgViewModel.svgFilePath = svgImgPath;
                    return View(SvgViewModel);
                }
                else
                {
                    return View(SvgViewModel);
                }
            }
            catch(Exception e)
            {
                return View();
            }
        }

        [Route("warp/addNew/{words}/{styleIndex}")]
        [HttpGet]
        public ActionResult addNew(string words, int styleIndex)
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
            catch (Exception e)
            {
                return Json(new { status = "error", id = e.Message });
            }
        }

        public IActionResult CreateNew()
        {
            return View();
        }

        [HttpGet]
        public ActionResult GeneratePalettes()
        {
            try
            {
                var palettes = _context.BrandmarkColors.OrderBy(r => Guid.NewGuid()).Take(7);
                return Json(new { palettes = palettes, status = 200 });
            }
            catch (Exception e)
            {
                return Json(new { status = e.Message });
            }
        }

        [Route("/warp/getcolors/{number?}")]
        [HttpGet]
        public ActionResult GetColors(int number)
        {
            try
            {
                var colors = _context.BrandmarkColors.OrderBy(r => Guid.NewGuid()).Take(number);
                return Json(new { colors = colors, status = 200 });
            }
            catch (Exception e)
            {
                return Json(new { status = 500, message = e.Message });
            }
        }

        [Route("warp/save/{id?}")]
        [HttpPost]
        public ActionResult Save(int id, IFormFile svg_file)
        {
            try
            {
                var svgImgPath = "";
                var warpedImg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();

                if (warpedImg.SvgfileName != null && warpedImg.SvgfileName != "")
                {
                    svgImgPath = warpedImg.SvgfileName;
                    warpedImg.UpdatedAt = DateTime.Now;
                    warpedImg.Version += 1;
                }
                else
                {
                    var filename = Guid.NewGuid().ToString() + ".svg";
                    svgImgPath = "svgFiles\\" + filename;
                    warpedImg.SvgfileName = "svgFiles/" + filename;
                }

                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads");
                if (!Directory.Exists(filepath))
                {
                    Directory.CreateDirectory(filepath);
                }
                if (!Directory.Exists(filepath + "\\svgFiles"))
                {
                    Directory.CreateDirectory(filepath + "\\svgFiles");
                }

                var imgfilepath = Path.Combine(filepath, svgImgPath);

                if (imgfilepath != null)
                {
                    using (var stream = new FileStream(imgfilepath, FileMode.Create))
                    {
                        svg_file.CopyTo(stream);
                    }
                }

                _context.WarpedSvgs.Update(warpedImg);
                _context.SaveChanges();

                return Json(new { status = "success" });
            }
            catch(Exception e)
            {
                return Json(new { status = "failed" });
            }
        }
    }
}
