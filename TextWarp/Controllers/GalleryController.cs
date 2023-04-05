using Microsoft.AspNetCore.Mvc;

namespace TextWarp.Controllers
{
    public class GalleryController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult NewWarp()
        { 
            return View(); 
        }
    }
}
