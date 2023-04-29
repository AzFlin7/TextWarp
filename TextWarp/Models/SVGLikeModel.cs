namespace TextWarp.Models
{
    public class SVGLikeModel
    {
        public IFormFile svg_file { set; get; }
        public String words { set; get; }
        public int styleIndex { set; get; }
        public string MediaId { get; set; }
    }
}
