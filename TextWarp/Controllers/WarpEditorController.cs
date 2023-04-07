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

    }
}
