using Microsoft.AspNetCore.Mvc;

namespace TextWarp.Controllers
{
    public class WarpEditorController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Editor()
        {
            return View();
        }

    }
}
