using Microsoft.AspNetCore.Mvc;

namespace TextWarp.Controllers
{
    public class WarpController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
