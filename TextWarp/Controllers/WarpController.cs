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
            var record = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();
            var SvgViewModel = new SVGViewModel();
            SvgViewModel.id = record.Id;
            SvgViewModel.words = record.Words;
            SvgViewModel.styleIndex = record.StyleIndex;
            return View(SvgViewModel);
        }

        [Route("warp/editor/{id?}")]
        public IActionResult Editor(int id)
        {
            var record = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();
            var SvgViewModel = new SVGViewModel();
            SvgViewModel.id = record.Id;
            SvgViewModel.words = record.Words;
            SvgViewModel.styleIndex = record.StyleIndex;
            if (record.SvgfileName != "")
            {
                var svgImgPath = "uploads/" + record.SvgfileName;
                SvgViewModel.svgFilePath = svgImgPath;
                return View(SvgViewModel);
            }
            else
            {
                return View(SvgViewModel);
            }
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
            var svgImgPath = "";
            var warpedImg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();

            if (warpedImg.SvgfileName != null && warpedImg.SvgfileName != "")
            {
                svgImgPath = warpedImg.SvgfileName;
                warpedImg.UpdatedAt = DateTime.Now;
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

    }
}
