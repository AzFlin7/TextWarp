namespace TextWarp.Models
{
    public class SVGSaveModel
    {
        public string words { get; set; }
        public int styleIndex { get; set; }
        public IFormFile svgFile { get; set; }
    }
}
