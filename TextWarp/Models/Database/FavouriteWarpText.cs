using System;
using System.Collections.Generic;

namespace TextWarp.Models.Database
{
    public partial class FavouriteWarpText
    {
        public int Id { get; set; }
        public int FontId { get; set; }
        public string SvgFileName { get; set; } = null!;
    }
}
