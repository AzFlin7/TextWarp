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
            try
            {
                var record = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();
                var SvgViewModel = new SVGViewModel();
                SvgViewModel.id = record.Id;
                SvgViewModel.words = record.Words;
                SvgViewModel.styleIndex = record.StyleIndex;
                return View(SvgViewModel);
            }
            catch(Exception e)
            {
                return View();
            }
        }

        [Route("warp/editor/{id?}")]
        public IActionResult Editor(int id)
        {
            try
            {
                var record = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();
                var SvgViewModel = new SVGViewModel();
                SvgViewModel.id = record.Id;
                SvgViewModel.words = record.Words;
                SvgViewModel.styleIndex = record.StyleIndex;
                if (record.SvgfileName != "")
                {
                    var svgImgPath = "uploads/" + record.SvgfileName+"?v="+record.Version;
                    SvgViewModel.svgFilePath = svgImgPath;
                    return View(SvgViewModel);
                }
                else
                {
                    return View(SvgViewModel);
                }
            }
            catch(Exception e)
            {
                return View();
            }
        }

        [Route("warp/addNew/{words}/{styleIndex}")]
        [HttpGet]
        public ActionResult addNew(string words, int styleIndex)
        {
            try
            {
                var saved_svgs = _context.WarpedSvgs.Where(s => s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d").ToList();
                var name = "Untitled" + "_" + DateTime.Now;
                var WarpedSvg = new WarpedSvg();
                WarpedSvg.CreatedAt = DateTime.Now;
                WarpedSvg.UpdatedAt = DateTime.Now;
                WarpedSvg.Words = words;
                WarpedSvg.StyleIndex = styleIndex;
                WarpedSvg.SvgfileName = "";
                WarpedSvg.WorkName = name;
                WarpedSvg.UserId = "41ae9ea6-035a-4bc6-98f9-fd758422de6d";
                WarpedSvg.Version = 0;
                _context.WarpedSvgs.Add(WarpedSvg);
                _context.SaveChanges();

                var savedSvg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.WorkName.Equals(name))).Single();

                return Json(new { status = "success", id = savedSvg.Id });
            }
            catch (Exception e)
            {
                return Json(new { status = "error", id = e.Message });
            }
        }

        public IActionResult CreateNew()
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
            try
            {
                var svgImgPath = "";
                var warpedImg = _context.WarpedSvgs.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();

                if (warpedImg.SvgfileName != null && warpedImg.SvgfileName != "")
                {
                    svgImgPath = warpedImg.SvgfileName;
                    warpedImg.UpdatedAt = DateTime.Now;
                    warpedImg.Version += 1;
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
                        like_svgs = like_svgs
                    });
                }
                return Json(new
                {
                    status = "succss",
                    msg = "There is no like svg."
                });
            }
            catch(Exception exp)
            {
                return Json(new
                {
                    status = "failed",
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

                var saved_like = _context.SvgLikes.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.SvgfileName == filename)).Single();

                return Json(new { status = "success", saved_svg = saved_like });
            }
            catch (Exception e)
            {
                return Json(new { status = "failed", msg = e.Message });
            }
        }

        [Route("warp/deleteLike/{id?}")]
        [HttpDelete]
        public ActionResult DeleteLike(int id)
        {
            try
            {
                var selected_svg = _context.SvgLikes.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();
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
                            _context.SvgLikes.Remove(selected_svg);
                            _context.SaveChanges();

                            return Json(new { status = "success" });
                        }
                        catch (Exception e) { return Json(new { status = "failed", msg = e.Message }); }
                    }
                    else
                    {
                        return Json(new { status = "failed", msg = "File Not found!" });
                    }
                }
                else
                {
                    return Json(new { status = "failed", msg = "Not found saved svg." });
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
                        design_svgs = design_svgs
                    });
                }
                return Json(new
                {
                    status = "succss",
                    msg = "There is no like svg."
                });
            }
            catch (Exception exp)
            {
                return Json(new
                {
                    status = "failed",
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

                var saved_Design = _context.MyDesigns.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.SvgfileName == filename)).Single();

                return Json(new { status = "success", saved_Design = saved_Design });
            }
            catch (Exception e)
            {
                return Json(new { status = "failed", msg = e.Message });
            }
        }

        [Route("warp/deleteDesign/{id?}")]
        [HttpDelete]
        public ActionResult DeleteDesign(int id)
        {
            try
            {
                var selected_Design = _context.MyDesigns.Where(s => (s.UserId == "41ae9ea6-035a-4bc6-98f9-fd758422de6d" && s.Id == id)).Single();
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
                            _context.MyDesigns.Remove(selected_Design);
                            _context.SaveChanges();

                            return Json(new { status = "success" });
                        }
                        catch (Exception e) { return Json(new { status = "failed", msg = e.Message }); }
                    }
                    else
                    {
                        return Json(new { status = "failed", msg = "File Not found!" });
                    }
                }
                else
                {
                    return Json(new { status = "failed", msg = "Not found saved svg." });
                }
            }
            catch (Exception exp)
            {
                return Json(new { status = "failed", msg = exp.Message });
            }
        }
    }
}
