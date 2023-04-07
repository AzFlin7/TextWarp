using Microsoft.AspNetCore.Mvc;
using TextWarp.Models.Database;

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
            var saved_svgs = _context.WarppedSvgs.Where(s => s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d").ToList();
            return View(saved_svgs);
        }

        [HttpPost]
        public ActionResult createNewWarpedText()
        {
            var names = _context.WarppedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d") && s.WorkName.StartsWith("Untitled")).ToList();
            var name = "Untitled1";
            if (names.Count > 0)
            {
                name = "Untitled" + (names.Count + 1);
            }
            var warppedSvg = new WarppedSvg();
            warppedSvg.CreatedAt = DateTime.Now;
            warppedSvg.UpdatedAt = DateTime.Now;
            warppedSvg.WorkName = name;
            warppedSvg.UserId = "41ae9ea6-035a-4bc6-98f9-fd758422de6d";
            _context.WarppedSvgs.Add(warppedSvg);
            _context.SaveChanges();

            var savedSvg = _context.WarppedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.WorkName.Equals(name))).Single();

            return Json(new { status = "success", id = savedSvg.Id });
        }

        public IActionResult NewWarp()
        { 
            return View(); 
        }
    }
}
