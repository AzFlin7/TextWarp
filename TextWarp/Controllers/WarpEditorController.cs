using Microsoft.AspNetCore.Mvc;
using TextWarp.Models.Database;

namespace TextWarp.Controllers
{
    public class WarpEditorController : Controller
    {
        cfcreatorContext _context;
        public WarpEditorController(cfcreatorContext context)
        {
            this._context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Editor()
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

        [Route("warpeditor/save/{id?}")]
        [HttpPost]
        public ActionResult Save(int id, IFormFile svgFile)
        {
            var svgImgPath = "";
            var warppedImg = _context.WarppedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();

            if (warppedImg.SvgfileName != null && warppedImg.SvgfileName != "")
            {
                svgImgPath = warppedImg.SvgfileName;
            }
            else
            {
                var filename = Guid.NewGuid().ToString() + ".svg";
                svgImgPath = "svgFiles/" + filename;
                warppedImg.SvgfileName = svgImgPath;
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
                    svgFile.CopyTo(stream);
                }
            }

            _context.WarppedSvgs.Update(warppedImg);
            _context.SaveChanges();

            return Json(new { status = "success" });
        }

    }
}
