using Microsoft.AspNetCore.HttpLogging;
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

        [Route("warp")]
        public IActionResult Index(string words, int style)
        {
            var SvgViewModel = new SVGViewModel();
            try
            {
                List<BrandmarkColor> colors = _context.BrandmarkColors.OrderBy(r => Guid.NewGuid()).Take(2).ToList();
                SvgViewModel.words = words;
                SvgViewModel.styleIndex = style;
                SvgViewModel.msg = "";
                SvgViewModel.initColors = colors;
                return View(SvgViewModel);
            }
            catch(Exception e)
            {
                SvgViewModel.words = "";
                SvgViewModel.styleIndex = -1;
                SvgViewModel.msg = "";
                SvgViewModel.initColors = new List<BrandmarkColor>();
                return View(SvgViewModel);
            }  
        }

        public IActionResult CreateNew()
        {
            return View();
        }

        [Route("warp/editor")]
        public IActionResult Editor(string mediaId, string words, int style)
        {
            try
            {
                var warpText = _context.WarpedSvgs.Where(w => w.MediaId == mediaId).FirstOrDefault();
                var SvgViewModel = new SVGViewModel
                {
                    words = words,
                    styleIndex = style,
                    msg = "",
                    version = 1,
                    mediaId = mediaId
                };
                if (warpText != null) {
                    var svgImgPath = "uploads/" + warpText.SvgfileName + "?v=" + warpText.Version;
                    SvgViewModel.svgFilePath = svgImgPath;
                    SvgViewModel.version = warpText.Version;
                }
                return View(SvgViewModel);
            }
            catch(Exception e)
            {
                var SvgViewModel = new SVGViewModel
                {
                    words = "",
                    styleIndex = -1,
                    msg = "Raised exception.",
                    version = -1,
                    mediaId = mediaId
                };
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

        [Route("warp/save/{mediaId}")]
        [HttpPost]
        public ActionResult Save(string mediaId, SVGSaveModel sVGSaveModel)
        {
            try
            {
                var svgImgPath = "";
                var imgfilepath = "";
                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads");

                WarpedSvg warpedImg = _context.WarpedSvgs.Where(w => w.MediaId == mediaId).FirstOrDefault();
                if (warpedImg != null)
                {
                    svgImgPath = warpedImg.SvgfileName;
                    imgfilepath = Path.Combine(filepath, svgImgPath);
                    using (var stream = new FileStream(imgfilepath, FileMode.Create))
                    {
                        sVGSaveModel.svgFile.CopyTo(stream);
                    }
                    warpedImg.UpdatedAt = DateTime.Now;
                    warpedImg.Version += 1;
                    _context.WarpedSvgs.Update(warpedImg);
                    _context.SaveChanges();
                }
                else
                {
                    var filename = Guid.NewGuid().ToString() + ".svg";
                    svgImgPath = "svgFiles\\" + filename;

                    if (!Directory.Exists(filepath))
                    {
                        Directory.CreateDirectory(filepath);
                    }
                    if (!Directory.Exists(filepath + "\\svgFiles"))
                    {
                        Directory.CreateDirectory(filepath + "\\svgFiles");
                    }
                    imgfilepath = Path.Combine(filepath, svgImgPath);
                    using (var stream = new FileStream(imgfilepath, FileMode.Create))
                    {
                        sVGSaveModel.svgFile.CopyTo(stream);
                    }
                    svgImgPath = "svgFiles/" + filename;
                    WarpedSvg warpedSvg = new WarpedSvg
                    {
                        MediaId = mediaId,
                        Words = sVGSaveModel.words,
                        StyleIndex = sVGSaveModel.styleIndex,
                        SvgfileName = svgImgPath,
                        WorkName = "Untitled",
                        UserId = "41ae9ea6-035a-4bc6-98f9-fd758422de6d",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        Version = 1
                    };
                    _context.WarpedSvgs.Add(warpedSvg);
                    _context.SaveChanges();
                }

                return Json(new { status = "success" });
            }
            catch(Exception e)
            {
                return Json(new { status = "failed" });
            }
        }

        [Route("warp/getLikes")]
        [HttpGet]
        public ActionResult GetLikes()
        {
            try
            {
                var like_svgs = _context.SvgLikes.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d")).ToList();
                if (like_svgs.Count > 0)
                {
                    return Json(new
                    {
                        status = "success",
                        like_svgs = like_svgs,
                        msg = ""
                    });
                }
                return Json(new
                {
                    status = "succss",
                    like_svgs = new List<SvgLike>(),
                    msg = "There is no like svg."
                });
            }
            catch(Exception exp)
            {
                return Json(new
                {
                    status = "failed",
                    like_svg = new List<SvgLike>(),
                    msg = exp.Message
                });
            }
        }

        [Route("warp/saveLike/")]
        [HttpPost]
        public ActionResult SaveLike(SVGLikeModel svgLikeModel)
        {
            try
            {
                var svgImgPath = "";
                var newSvgLike = new SvgLike();
                var filename = Guid.NewGuid().ToString() + ".svg";
                svgImgPath = "svgLikes\\" + filename;
                filename = "svgLikes/" + filename;
                newSvgLike.SvgfileName = filename;
                newSvgLike.UserId = "41ae9ea6-035a-4bc6-98f9-fd758422de6d";
                newSvgLike.Words = svgLikeModel.words;
                newSvgLike.StyleIndex = svgLikeModel.styleIndex;
                newSvgLike.CreatedAt = DateTime.Now;
                newSvgLike.MediaId = svgLikeModel.MediaId;

                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads");
                if (!Directory.Exists(filepath))
                {
                    Directory.CreateDirectory(filepath);
                }
                if (!Directory.Exists(filepath + "\\svgLikes"))
                {
                    Directory.CreateDirectory(filepath + "\\svgLikes");
                }

                var imgfilepath = Path.Combine(filepath, svgImgPath);

                if (imgfilepath != null)
                {
                    using (var stream = new FileStream(imgfilepath, FileMode.Create))
                    {
                        svgLikeModel.svg_file.CopyTo(stream);
                    }
                }

                _context.SvgLikes.Add(newSvgLike);
                _context.SaveChanges();

                return Json(new { status = "success", saved_svg = newSvgLike, msg = "" });
            }
            catch (Exception e)
            {
                return Json(new { status = "failed", saved_svg = new List<SVGLikeModel>(), msg = e.Message });
            }
        }

        [Route("warp/deleteLike/{mediaId?}")]
        public ActionResult DeleteLike(string mediaId)
        {
            try
            {
                var selected_svg = _context.SvgLikes.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.MediaId == mediaId)).Single();
                if(selected_svg != null)
                {
                    var fileName = selected_svg.SvgfileName;
                    var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads");
                    fileName = Path.Combine(filepath, fileName);
                    if (System.IO.File.Exists(fileName))
                    {
                        try
                        {
                            System.IO.File.Delete(fileName);
                        }
                        catch (Exception e) { return Json(new { status = "failed", msg = e.Message }); }
                    }
                    _context.SvgLikes.Remove(selected_svg);
                    _context.SaveChanges();
                    return Json(new { status = "success", msg = "" });
                }
                else
                {
                    return Json(new { status = "failed", msg = "Not found record." });
                }
            }
            catch (Exception exp)
            {
                return Json(new { status = "failed", msg = exp.Message });
            }
        }

        [Route("warp/getDesigns")]
        [HttpGet]
        public ActionResult GetDesigns()
        {
            try
            {
                var design_svgs = _context.MyDesigns.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d")).ToList();
                if (design_svgs.Count > 0)
                {
                    return Json(new
                    {
                        status = "success",
                        design_svgs = design_svgs,
                        msg = ""
                    });
                }
                return Json(new
                {
                    status = "succss",
                    design_svgs = new List<MyDesign>(),
                    msg = "There is no my design."
                });
            }
            catch (Exception exp)
            {
                return Json(new
                {
                    status = "failed",
                    design_svgs = new List<MyDesign>(),
                    msg = exp.Message
                });
            }
        }

        [Route("warp/saveDesign/")]
        [HttpPost]
        public ActionResult SaveDesign(SVGDesignModel svgDesignModel)
        {
            try
            {
                var svgImgPath = "";
                var newDesign = new MyDesign();
                var filename = Guid.NewGuid().ToString() + ".svg";
                svgImgPath = "myDesigns\\" + filename;
                filename = "myDesigns/" + filename;
                newDesign.SvgfileName = filename;
                newDesign.UserId = "41ae9ea6-035a-4bc6-98f9-fd758422de6d";
                newDesign.Words = svgDesignModel.words;
                newDesign.StyleIndex = svgDesignModel.styleIndex;
                newDesign.MediaId = svgDesignModel.MediaId;
                newDesign.CreatedAt = DateTime.Now;
                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads");
                if (!Directory.Exists(filepath))
                {
                    Directory.CreateDirectory(filepath);
                }
                if (!Directory.Exists(filepath + "\\myDesigns"))
                {
                    Directory.CreateDirectory(filepath + "\\myDesigns");
                }

                var imgfilepath = Path.Combine(filepath, svgImgPath);

                if (imgfilepath != null)
                {
                    using (var stream = new FileStream(imgfilepath, FileMode.Create))
                    {
                        svgDesignModel.svg_file.CopyTo(stream);
                    }
                }

                _context.MyDesigns.Add(newDesign);
                _context.SaveChanges();

                return Json(new { status = "success", saved_Design = newDesign, msg = "" });
            }
            catch (Exception e)
            {
                return Json(new { status = "failed", saved_Design = new List<MyDesign>(), msg = e.Message });
            }
        }

        [Route("warp/deleteDesign")]
        public ActionResult DeleteDesign(string mediaId)
        {
            try
            {
                var selected_Design = _context.MyDesigns.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.MediaId == mediaId)).FirstOrDefault();
                if (selected_Design != null)
                {
                    var fileName = selected_Design.SvgfileName;
                    var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads");
                    fileName = Path.Combine(filepath, fileName);
                    if (System.IO.File.Exists(fileName))
                    {
                        try
                        {
                            System.IO.File.Delete(fileName);
                        }
                        catch (Exception e) { return Json(new { status = "failed", msg = e.Message }); }
                    }
                    _context.MyDesigns.Remove(selected_Design);
                    _context.SaveChanges();
                    return Json(new { status = "success", msg = "" });
                }
                else
                {
                    return Json(new { status = "failed", msg = "Not found record." });
                }
            }
            catch (Exception exp)
            {
                return Json(new { status = "failed", msg = exp.Message });
            }
        }

        public IActionResult Finalize()
        {
            return View();
        }
    }
}
