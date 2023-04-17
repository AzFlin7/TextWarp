using Microsoft.AspNetCore.Mvc;

namespace TextWarp.Controllers
{
    public class AccountController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly string cfcreatorAccountLogin;
        public AccountController(IConfiguration configuration)
        {
            _configuration = configuration;
            cfcreatorAccountLogin = _configuration["CfcreatorAccountLogin"].ToString();
        }
        public IActionResult Login()
        {
            if (User.Identity.IsAuthenticated)
                return Redirect("/");

            return Redirect(cfcreatorAccountLogin);
        }
    }
}
