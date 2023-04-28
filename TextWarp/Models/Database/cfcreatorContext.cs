using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace TextWarp.Models.Database
{
    public partial class cfcreatorContext : DbContext
    {
        public cfcreatorContext()
        {
        }

        public cfcreatorContext(DbContextOptions<cfcreatorContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Artist> Artists { get; set; } = null!;
        public virtual DbSet<AspNetRole> AspNetRoles { get; set; } = null!;
        public virtual DbSet<AspNetRoleClaim> AspNetRoleClaims { get; set; } = null!;
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; } = null!;
        public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; } = null!;
        public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; } = null!;
        public virtual DbSet<AspNetUserToken> AspNetUserTokens { get; set; } = null!;
        public virtual DbSet<BrandmarkColor> BrandmarkColors { get; set; } = null!;
        public virtual DbSet<Brush> Brushes { get; set; } = null!;
        public virtual DbSet<Clipart> Cliparts { get; set; } = null!;
        public virtual DbSet<Document> Documents { get; set; } = null!;
        public virtual DbSet<FavouriteWarpText> FavouriteWarpTexts { get; set; } = null!;
        public virtual DbSet<Font> Fonts { get; set; } = null!;
        public virtual DbSet<Graffix> Graffixes { get; set; } = null!;
        public virtual DbSet<MyDesign> MyDesigns { get; set; } = null!;
        public virtual DbSet<SvgLike> SvgLikes { get; set; } = null!;
        public virtual DbSet<Upload> Uploads { get; set; } = null!;
        public virtual DbSet<WarpedSvg> WarpedSvgs { get; set; } = null!;
        public virtual DbSet<Warpfont> Warpfonts { get; set; } = null!;
        public virtual DbSet<Wynwood> Wynwoods { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=10.10.16.94,3000;Database=cfcreator;persist security info=True;MultipleActiveResultSets=True;User ID=sa;Password=Sqlpassword37;TrustServerCertificate=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Artist>(entity =>
            {
                entity.ToTable("artists");

                entity.Property(e => e.CreatedAt).HasColumnType("datetime");

                entity.Property(e => e.DeletedAt).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(50);

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.SubTitle).HasMaxLength(50);
            });

            modelBuilder.Entity<AspNetRole>(entity =>
            {
                entity.HasIndex(e => e.NormalizedName, "RoleNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedName] IS NOT NULL)");

                entity.Property(e => e.Name).HasMaxLength(256);

                entity.Property(e => e.NormalizedName).HasMaxLength(256);
            });

            modelBuilder.Entity<AspNetRoleClaim>(entity =>
            {
                entity.HasIndex(e => e.RoleId, "IX_AspNetRoleClaims_RoleId");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetRoleClaims)
                    .HasForeignKey(d => d.RoleId);
            });

            modelBuilder.Entity<AspNetUser>(entity =>
            {
                entity.HasIndex(e => e.NormalizedEmail, "EmailIndex");

                entity.HasIndex(e => e.NormalizedUserName, "UserNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedUserName] IS NOT NULL)");

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.NormalizedEmail).HasMaxLength(256);

                entity.Property(e => e.NormalizedUserName).HasMaxLength(256);

                entity.Property(e => e.UserName).HasMaxLength(256);

                entity.HasMany(d => d.Roles)
                    .WithMany(p => p.Users)
                    .UsingEntity<Dictionary<string, object>>(
                        "AspNetUserRole",
                        l => l.HasOne<AspNetRole>().WithMany().HasForeignKey("RoleId"),
                        r => r.HasOne<AspNetUser>().WithMany().HasForeignKey("UserId"),
                        j =>
                        {
                            j.HasKey("UserId", "RoleId");

                            j.ToTable("AspNetUserRoles");

                            j.HasIndex(new[] { "RoleId" }, "IX_AspNetUserRoles_RoleId");
                        });
            });

            modelBuilder.Entity<AspNetUserClaim>(entity =>
            {
                entity.HasIndex(e => e.UserId, "IX_AspNetUserClaims_UserId");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserClaims)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserLogin>(entity =>
            {
                entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });

                entity.HasIndex(e => e.UserId, "IX_AspNetUserLogins_UserId");

                entity.Property(e => e.LoginProvider).HasMaxLength(128);

                entity.Property(e => e.ProviderKey).HasMaxLength(128);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserLogins)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserToken>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name });

                entity.Property(e => e.LoginProvider).HasMaxLength(128);

                entity.Property(e => e.Name).HasMaxLength(128);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserTokens)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<BrandmarkColor>(entity =>
            {
                entity.Property(e => e.Color1)
                    .HasMaxLength(10)
                    .UseCollation("Korean_Wansung_CI_AS");

                entity.Property(e => e.Color2)
                    .HasMaxLength(10)
                    .UseCollation("Korean_Wansung_CI_AS");

                entity.Property(e => e.Color3)
                    .HasMaxLength(10)
                    .UseCollation("Korean_Wansung_CI_AS");

                entity.Property(e => e.Color4)
                    .HasMaxLength(10)
                    .UseCollation("Korean_Wansung_CI_AS");

                entity.Property(e => e.Color5)
                    .HasMaxLength(10)
                    .UseCollation("Korean_Wansung_CI_AS");

                entity.Property(e => e.IndexColor)
                    .HasMaxLength(50)
                    .UseCollation("Korean_Wansung_CI_AS");
            });

            modelBuilder.Entity<Brush>(entity =>
            {
                entity.Property(e => e.JsonPath).HasColumnType("text");

                entity.Property(e => e.UserId).HasMaxLength(450);

                entity.Property(e => e.Version).HasDefaultValueSql("((1))");
            });

            modelBuilder.Entity<Clipart>(entity =>
            {
                entity.ToTable("cliparts");

                entity.Property(e => e.CreatedAt).HasColumnType("datetime");

                entity.Property(e => e.DeletedAt).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(50);

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.SubTitle).HasMaxLength(50);
            });

            modelBuilder.Entity<Document>(entity =>
            {
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");

                entity.Property(e => e.DeletedAt).HasColumnType("datetime");

                entity.Property(e => e.JsonPath)
                    .HasColumnType("text")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.MediaId).HasMaxLength(50);

                entity.Property(e => e.Name).HasMaxLength(256);

                entity.Property(e => e.PreviewImg)
                    .HasColumnType("text")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.State)
                    .HasColumnType("text")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

                entity.Property(e => e.UserId).HasMaxLength(450);

                entity.Property(e => e.Version).HasDefaultValueSql("((1))");
            });

            modelBuilder.Entity<FavouriteWarpText>(entity =>
            {
                entity.ToTable("favouriteWarpTexts");

                entity.Property(e => e.FontId).HasColumnName("fontId");

                entity.Property(e => e.SvgFileName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("svgFileName");
            });

            modelBuilder.Entity<Font>(entity =>
            {
                entity.HasIndex(e => e.Family, "NonClusteredIndex-20181225-110313");

                entity.Property(e => e.Family)
                    .HasMaxLength(100)
                    .UseCollation("Korean_Wansung_CI_AS");

                entity.Property(e => e.InitShow).HasDefaultValueSql("((0))");

                entity.Property(e => e.Title).HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<Graffix>(entity =>
            {
                entity.ToTable("graffixes");

                entity.Property(e => e.CreatedAt).HasColumnType("datetime");

                entity.Property(e => e.DeletedAt).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(50);

                entity.Property(e => e.MediaId).HasMaxLength(50);

                entity.Property(e => e.Oheight).HasColumnName("OHeight");

                entity.Property(e => e.Ourl)
                    .HasMaxLength(50)
                    .HasColumnName("OUrl");

                entity.Property(e => e.Owidth).HasColumnName("OWidth");

                entity.Property(e => e.Theight).HasColumnName("THeight");

                entity.Property(e => e.Title).HasMaxLength(50);

                entity.Property(e => e.Turl)
                    .HasMaxLength(50)
                    .HasColumnName("TUrl");

                entity.Property(e => e.Twidth).HasColumnName("TWidth");
            });

            modelBuilder.Entity<MyDesign>(entity =>
            {
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");

                entity.Property(e => e.SvgfileName)
                    .HasMaxLength(450)
                    .HasColumnName("SVGFileName");

                entity.Property(e => e.UserId)
                    .HasMaxLength(450)
                    .HasColumnName("UserID");

                entity.Property(e => e.Words)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<SvgLike>(entity =>
            {
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");

                entity.Property(e => e.SvgfileName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("SVGFileName");

                entity.Property(e => e.UserId)
                    .HasMaxLength(450)
                    .HasColumnName("UserID");

                entity.Property(e => e.Words)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Upload>(entity =>
            {
                entity.ToTable("uploads");

                entity.Property(e => e.CreatedAt).HasColumnType("datetime");

                entity.Property(e => e.DeletedAt).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(50);

                entity.Property(e => e.MediaId).HasMaxLength(50);

                entity.Property(e => e.Oheight).HasColumnName("OHeight");

                entity.Property(e => e.Ourl)
                    .HasMaxLength(50)
                    .HasColumnName("OUrl");

                entity.Property(e => e.Owidth).HasColumnName("OWidth");

                entity.Property(e => e.Theight).HasColumnName("THeight");

                entity.Property(e => e.Title).HasMaxLength(50);

                entity.Property(e => e.Turl)
                    .HasMaxLength(50)
                    .HasColumnName("TUrl");

                entity.Property(e => e.Twidth).HasColumnName("TWidth");
            });

            modelBuilder.Entity<WarpedSvg>(entity =>
            {
                entity.ToTable("WarpedSVGs");

                entity.Property(e => e.CreatedAt).HasColumnType("datetime");

                entity.Property(e => e.DeletedAt).HasColumnType("datetime");

                entity.Property(e => e.SvgfileName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("SVGFileName");

                entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

                entity.Property(e => e.UserId)
                    .HasMaxLength(450)
                    .HasColumnName("UserID");

                entity.Property(e => e.Words).HasMaxLength(450);

                entity.Property(e => e.WorkName).HasMaxLength(450);
            });

            modelBuilder.Entity<Warpfont>(entity =>
            {
                entity.ToTable("warpfonts");

                entity.Property(e => e.CreatedAt).HasColumnType("datetime");

                entity.Property(e => e.DeletedAt).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Thumbnail).HasMaxLength(50);
            });

            modelBuilder.Entity<Wynwood>(entity =>
            {
                entity.ToTable("wynwoods");

                entity.Property(e => e.CreatedAt).HasColumnType("datetime");

                entity.Property(e => e.DeletedAt).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(50);

                entity.Property(e => e.MediaId).HasMaxLength(50);

                entity.Property(e => e.Oheight).HasColumnName("OHeight");

                entity.Property(e => e.Ourl)
                    .HasMaxLength(50)
                    .HasColumnName("OUrl");

                entity.Property(e => e.Owidth).HasColumnName("OWidth");

                entity.Property(e => e.Theight).HasColumnName("THeight");

                entity.Property(e => e.Title).HasMaxLength(50);

                entity.Property(e => e.Turl)
                    .HasMaxLength(50)
                    .HasColumnName("TUrl");

                entity.Property(e => e.Twidth).HasColumnName("TWidth");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
