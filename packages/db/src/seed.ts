import "dotenv/config";
import { db } from "./index.js";
import { inquiries, listings, testimonials, articles, agents, siteSettings } from "./schema.js";

async function seed() {
  console.log("Seeding database...");

  await db.transaction(async (tx) => {
    await tx.delete(inquiries);
    await tx.delete(listings);
    await tx.delete(articles);
    await tx.delete(testimonials);
    await tx.delete(siteSettings);
    await tx.delete(agents);

    const [agent1, agent2] = await tx.insert(agents).values([
      {
        name: "Budi Santoso", phone: "+6281234567890",
        email: "budi@property.com",
        bio: "<p>Agen properti berpengalaman 10+ tahun di Jabodetabek.</p>",
        specializations: ["Rumah", "Apartemen"], isActive: true,
      },
      {
        name: "Sari Dewi", phone: "+6281298765432",
        email: "sari@property.com",
        bio: "<p>Spesialis properti premium dan komersial.</p>",
        specializations: ["Villa", "Komersial"], isActive: true,
      },
    ]).returning();

    await tx.insert(listings).values([
      {
        slug: "rumah-modern-bsd-city",
        title: "Rumah Modern Minimalis di BSD City",
        description: "<p>Rumah modern dengan desain minimalis, lokasi strategis.</p>",
        price: "2500000000", type: "sale", category: "house",
        bedrooms: 4, bathrooms: 3, landArea: 150, buildingArea: 200,
        address: "BSD City, Tangerang Selatan", city: "Tangerang", province: "Banten",
        features: ["Swimming Pool", "Carport", "Smart Home", "Garden"],
        images: [], isFeatured: true, status: "available", template: "all",
        agentId: agent1.id,
      },
      {
        slug: "apartemen-sudirman-park",
        title: "Apartemen Premium Sudirman Park",
        description: "<p>Apartemen full furnished di jantung kota Jakarta.</p>",
        price: "15000000", type: "rent", category: "apartment",
        bedrooms: 2, bathrooms: 1, buildingArea: 65,
        address: "Jl. KH. Mas Mansyur, Jakarta Pusat", city: "Jakarta", province: "DKI Jakarta",
        features: ["Furnished", "Gym", "Pool", "Concierge"],
        images: [], isFeatured: true, status: "available", template: "all",
        agentId: agent1.id,
      },
      {
        slug: "villa-ubud-bali",
        title: "Villa Mewah di Ubud Bali",
        description: "<p>Villa eksklusif dengan pemandangan sawah dan private pool.</p>",
        price: "8500000000", type: "sale", category: "villa",
        bedrooms: 5, bathrooms: 5, landArea: 500, buildingArea: 400,
        address: "Ubud, Gianyar", city: "Gianyar", province: "Bali",
        features: ["Private Pool", "Rice Field View", "Tropical Garden"],
        images: [], isFeatured: true, status: "available", template: "luxury",
        agentId: agent2.id,
      },
    ]);

    await tx.insert(testimonials).values([
      {
        clientName: "Ahmad Rizki",
        content: "Proses pembelian rumah sangat mudah berkat tim yang profesional.",
        rating: 5, template: "all", isActive: true,
      },
      {
        clientName: "Linda Wijaya",
        content: "Apartemen yang kami sewa sesuai ekspektasi. Pelayanan memuaskan.",
        rating: 4, template: "all", isActive: true,
      },
    ]);

    await tx.insert(siteSettings).values([
      {
        template: "modern", siteName: "Properti Modern",
        heroTitle: "Temukan Hunian Impian Anda",
        heroSubtitle: "Koleksi properti terbaik dengan desain modern dan lokasi strategis",
        contactPhone: "+6281234567890", contactEmail: "info@propertimodern.com",
        contactAddress: "Jl. Sudirman No. 1, Jakarta",
      },
      {
        template: "luxury", siteName: "Luxury Estates",
        heroTitle: "Exclusive Living, Redefined",
        heroSubtitle: "Curated collection of the finest properties",
        contactPhone: "+6281298765432", contactEmail: "concierge@luxuryestates.id",
        contactAddress: "Plaza Indonesia Level 5, Jakarta",
      },
      {
        template: "classic", siteName: "Griya Nusantara",
        heroTitle: "Rumah Keluarga, Kebahagiaan Anda",
        heroSubtitle: "Properti terpercaya untuk keluarga Indonesia sejak 2010",
        contactPhone: "+6281112223333", contactEmail: "halo@griyanusantara.id",
        contactAddress: "Jl. Gatot Subroto No. 10, Jakarta",
      },
    ]);
  });

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => { console.error("Seed failed:", err); process.exit(1); });
