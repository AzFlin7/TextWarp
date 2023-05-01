namespace TextWarp.Models
{
    public class SVGViewModel
    {
        public string words { get; set; }
        public int styleIndex { get; set; }
        public string? svgFilePath { get; set; }
        public int? version { get; set; }
        public string? mediaId { get; set; }
        public string? msg { get; set; }
    }
}
