using Microsoft.AspNetCore.Mvc;
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

        public IActionResult Index()
        {
            return View();
        }
    }
}
