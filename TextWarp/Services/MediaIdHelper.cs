namespace TextWarp.Services
{
    public class MediaIdHelper
    {
        public static string generate(string type = "DESIGN")
        {
            if (type.Length == 0) type = "DESIGN";
            string prefix = type.Substring(0, 2).ToUpper();
            string mediId = CommonService.generateRNDString(10);
            return prefix + mediId;
        }
    }
}
