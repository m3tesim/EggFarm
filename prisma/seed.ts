import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  }),
});

const birds = [
  {
    slug: "chicken",
    nameEn: "Chickens",
    nameAr: "دجاج",
    descriptionEn: "Heritage, ornamental and high-production chicken breeds.",
    descriptionAr: "سلالات دجاج أصيلة وزينة وعالية الإنتاج.",
    incubationDays: 21,
  },
  {
    slug: "duck",
    nameEn: "Ducks",
    nameAr: "بط",
    descriptionEn: "Hardy ducks for eggs, meat and pest control.",
    descriptionAr: "بط قوي التحمل للبيض واللحم ومكافحة الآفات.",
    incubationDays: 28,
  },
  {
    slug: "quail",
    nameEn: "Quails",
    nameAr: "سمان",
    descriptionEn: "Fast-maturing quails, perfect for small spaces.",
    descriptionAr: "سمان سريع النضج ومثالي للمساحات الصغيرة.",
    incubationDays: 17,
  },
  {
    slug: "turkey",
    nameEn: "Turkeys",
    nameAr: "ديك رومي",
    descriptionEn: "Heritage turkeys raised on open pasture.",
    descriptionAr: "ديوك رومية أصيلة تربى في المراعي المفتوحة.",
    incubationDays: 28,
  },
  {
    slug: "goose",
    nameEn: "Geese",
    nameAr: "إوز",
    descriptionEn: "Large, calm geese that make excellent farm guardians.",
    descriptionAr: "إوز كبير وهادئ ويعد حارساً ممتازاً للمزرعة.",
    incubationDays: 30,
  },
  {
    slug: "guinea-fowl",
    nameEn: "Guinea Fowl",
    nameAr: "دجاج غيني",
    descriptionEn: "Alert, free-ranging birds that love eating ticks.",
    descriptionAr: "طيور يقظة تحب التجوال وتتغذى على القراد.",
    incubationDays: 27,
  },
  {
    slug: "pigeon",
    nameEn: "Pigeons",
    nameAr: "حمام",
    descriptionEn: "Racing and fancy pigeon lines from proven pairs.",
    descriptionAr: "سلالات حمام زاجل وزينة من أزواج مجربة.",
    incubationDays: 18,
  },
  {
    slug: "peafowl",
    nameEn: "Peafowl",
    nameAr: "طاووس",
    descriptionEn: "Stunning ornamental peafowl for experienced keepers.",
    descriptionAr: "طواويس زينة مذهلة للمربين ذوي الخبرة.",
    incubationDays: 28,
  },
];

type ProductSeed = {
  slug: string;
  bird: string;
  breedEn: string;
  breedAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number; // in dollars
  minOrder: number;
  stock: number;
  hatchRate: number;
  shellColor: string;
  speckled?: boolean;
  featured?: boolean;
};

const products: ProductSeed[] = [
  {
    slug: "rhode-island-red",
    bird: "chicken",
    breedEn: "Rhode Island Red",
    breedAr: "رود آيلاند الأحمر",
    descriptionEn:
      "A dependable dual-purpose breed laying around 250 brown eggs a year. Friendly, hardy and great for beginners.",
    descriptionAr:
      "سلالة ثنائية الغرض موثوقة تضع حوالي 250 بيضة بنية سنوياً. ودودة وقوية ومثالية للمبتدئين.",
    price: 2.5,
    minOrder: 6,
    stock: 240,
    hatchRate: 85,
    shellColor: "#b5764a",
    featured: true,
  },
  {
    slug: "araucana",
    bird: "chicken",
    breedEn: "Araucana",
    breedAr: "أراوكانا",
    descriptionEn:
      "Famous for its naturally blue eggs and tufted ears. A striking addition to any flock.",
    descriptionAr:
      "مشهورة ببيضها الأزرق الطبيعي وخصلات الأذن. إضافة لافتة لأي قطيع.",
    price: 4.75,
    minOrder: 6,
    stock: 96,
    hatchRate: 78,
    shellColor: "#a8d0cf",
    featured: true,
  },
  {
    slug: "marans-black-copper",
    bird: "chicken",
    breedEn: "Black Copper Marans",
    breedAr: "ماران النحاسي الأسود",
    descriptionEn:
      "Lays the darkest chocolate-brown eggs of any breed. Calm temperament and cold hardy.",
    descriptionAr:
      "تضع أغمق بيض بني شوكولاتي بين جميع السلالات. هادئة الطباع وتتحمل البرد.",
    price: 5.5,
    minOrder: 6,
    stock: 72,
    hatchRate: 75,
    shellColor: "#6b3a24",
    speckled: true,
  },
  {
    slug: "leghorn-white",
    bird: "chicken",
    breedEn: "White Leghorn",
    breedAr: "ليجهورن الأبيض",
    descriptionEn:
      "The champion layer: 280+ large white eggs per year with excellent feed efficiency.",
    descriptionAr:
      "بطلة الإنتاج: أكثر من 280 بيضة بيضاء كبيرة سنوياً مع كفاءة عالية في استهلاك العلف.",
    price: 1.9,
    minOrder: 12,
    stock: 480,
    hatchRate: 88,
    shellColor: "#f7f3ec",
  },
  {
    slug: "fayoumi",
    bird: "chicken",
    breedEn: "Egyptian Fayoumi",
    breedAr: "الفيومي المصري",
    descriptionEn:
      "An ancient Egyptian breed, heat tolerant and highly disease resistant. Lays early and often.",
    descriptionAr:
      "سلالة مصرية عريقة تتحمل الحرارة ومقاومة للأمراض. تبدأ الإنتاج مبكراً وبكثرة.",
    price: 2.2,
    minOrder: 6,
    stock: 300,
    hatchRate: 87,
    shellColor: "#efe2cc",
    featured: true,
  },
  {
    slug: "brahma-light",
    bird: "chicken",
    breedEn: "Light Brahma",
    breedAr: "براهما الفاتح",
    descriptionEn:
      "Gentle giants with feathered feet. Excellent winter layers and very docile with children.",
    descriptionAr:
      "عمالقة لطيفة بأقدام مكسوة بالريش. تبيض جيداً في الشتاء وهادئة جداً مع الأطفال.",
    price: 3.9,
    minOrder: 6,
    stock: 110,
    hatchRate: 80,
    shellColor: "#d9b48c",
  },
  {
    slug: "pekin-duck",
    bird: "duck",
    breedEn: "Pekin Duck",
    breedAr: "بط بكيني",
    descriptionEn:
      "The classic white duck. Fast growing, calm and a strong layer of large eggs.",
    descriptionAr: "البط الأبيض الكلاسيكي. سريع النمو وهادئ ويضع بيضاً كبيراً بغزارة.",
    price: 3.2,
    minOrder: 6,
    stock: 150,
    hatchRate: 82,
    shellColor: "#eef0e6",
    featured: true,
  },
  {
    slug: "khaki-campbell",
    bird: "duck",
    breedEn: "Khaki Campbell",
    breedAr: "خاكي كامبل",
    descriptionEn:
      "One of the most prolific egg-laying ducks, producing up to 300 eggs a year.",
    descriptionAr: "من أغزر أنواع البط في إنتاج البيض، حتى 300 بيضة سنوياً.",
    price: 3.6,
    minOrder: 6,
    stock: 90,
    hatchRate: 80,
    shellColor: "#dfe5d3",
  },
  {
    slug: "muscovy",
    bird: "duck",
    breedEn: "Muscovy Duck",
    breedAr: "بط مسكوفي",
    descriptionEn:
      "Quiet, excellent mothers and superb foragers. Popular for lean, flavourful meat.",
    descriptionAr: "بط هادئ وأمهات ممتازة وباحث رائع عن الغذاء. مشهور بلحمه قليل الدهن.",
    price: 4.2,
    minOrder: 4,
    stock: 60,
    hatchRate: 76,
    shellColor: "#ece5d2",
  },
  {
    slug: "japanese-quail",
    bird: "quail",
    breedEn: "Japanese Coturnix Quail",
    breedAr: "السمان الياباني",
    descriptionEn:
      "Starts laying at just 7 weeks. Tiny speckled eggs packed with flavour.",
    descriptionAr: "يبدأ بوضع البيض في عمر 7 أسابيع فقط. بيض صغير منقط غني بالنكهة.",
    price: 0.6,
    minOrder: 24,
    stock: 1200,
    hatchRate: 84,
    shellColor: "#d7c7a8",
    speckled: true,
    featured: true,
  },
  {
    slug: "texas-a-and-m-quail",
    bird: "quail",
    breedEn: "Texas A&M Quail",
    breedAr: "سمان تكساس الأبيض",
    descriptionEn:
      "A larger, white-feathered meat quail line with excellent growth rates.",
    descriptionAr: "سلالة سمان لاحم أكبر حجماً بريش أبيض ومعدل نمو ممتاز.",
    price: 0.8,
    minOrder: 24,
    stock: 600,
    hatchRate: 80,
    shellColor: "#cdbd9c",
    speckled: true,
  },
  {
    slug: "bronze-turkey",
    bird: "turkey",
    breedEn: "Standard Bronze Turkey",
    breedAr: "الديك الرومي البرونزي",
    descriptionEn:
      "A majestic heritage turkey with shimmering bronze plumage. Naturally mating line.",
    descriptionAr: "ديك رومي أصيل مهيب بريش برونزي لامع. سلالة تتزاوج طبيعياً.",
    price: 7.5,
    minOrder: 4,
    stock: 48,
    hatchRate: 72,
    shellColor: "#e3cfae",
    speckled: true,
  },
  {
    slug: "bourbon-red-turkey",
    bird: "turkey",
    breedEn: "Bourbon Red Turkey",
    breedAr: "الديك الرومي بوربون الأحمر",
    descriptionEn:
      "Rich chestnut feathers and renowned flavour. Great foragers on pasture.",
    descriptionAr: "ريش كستنائي غني ونكهة مشهورة. باحث ممتاز عن الغذاء في المراعي.",
    price: 8.0,
    minOrder: 4,
    stock: 36,
    hatchRate: 70,
    shellColor: "#e8d5b5",
    speckled: true,
  },
  {
    slug: "toulouse-goose",
    bird: "goose",
    breedEn: "Toulouse Goose",
    breedAr: "إوز تولوز",
    descriptionEn:
      "A large grey French goose, docile and easy to keep. Excellent for grass management.",
    descriptionAr: "إوز فرنسي رمادي كبير، هادئ وسهل التربية. ممتاز للحفاظ على العشب.",
    price: 9.5,
    minOrder: 2,
    stock: 30,
    hatchRate: 68,
    shellColor: "#f4f1ea",
  },
  {
    slug: "egyptian-goose",
    bird: "goose",
    breedEn: "Egyptian Goose",
    breedAr: "الإوز المصري",
    descriptionEn:
      "Colourful and striking, native to the Nile valley. Ornamental and hardy.",
    descriptionAr: "إوز ملون ولافت للنظر، موطنه وادي النيل. للزينة وقوي التحمل.",
    price: 11,
    minOrder: 2,
    stock: 20,
    hatchRate: 65,
    shellColor: "#f0e9da",
    featured: true,
  },
  {
    slug: "pearl-guinea",
    bird: "guinea-fowl",
    breedEn: "Pearl Guinea Fowl",
    breedAr: "الدجاج الغيني اللؤلؤي",
    descriptionEn:
      "Grey plumage dotted with white pearls. Natural alarm system and tick eater.",
    descriptionAr: "ريش رمادي منقط باللؤلؤ الأبيض. نظام إنذار طبيعي وآكل للقراد.",
    price: 2.8,
    minOrder: 6,
    stock: 140,
    hatchRate: 78,
    shellColor: "#c9a47a",
    speckled: true,
  },
  {
    slug: "homing-pigeon",
    bird: "pigeon",
    breedEn: "Racing Homer Pigeon",
    breedAr: "الحمام الزاجل",
    descriptionEn:
      "From proven racing parents with strong homing instinct and stamina.",
    descriptionAr: "من آباء سباقات مجربين بغريزة عودة قوية وقدرة تحمل عالية.",
    price: 6.0,
    minOrder: 2,
    stock: 40,
    hatchRate: 74,
    shellColor: "#fbfaf6",
  },
  {
    slug: "india-blue-peafowl",
    bird: "peafowl",
    breedEn: "India Blue Peafowl",
    breedAr: "الطاووس الهندي الأزرق",
    descriptionEn:
      "The iconic peacock with brilliant blue neck and spectacular train.",
    descriptionAr: "الطاووس الأيقوني بعنقه الأزرق اللامع وذيله المذهل.",
    price: 18,
    minOrder: 1,
    stock: 12,
    hatchRate: 62,
    shellColor: "#e6d6ba",
    featured: true,
  },
];

async function main() {
  const birdIds = new Map<string, string>();

  for (const [index, bird] of birds.entries()) {
    const saved = await db.bird.upsert({
      where: { slug: bird.slug },
      update: { ...bird, sortOrder: index },
      create: { ...bird, sortOrder: index },
    });
    birdIds.set(bird.slug, saved.id);
  }

  for (const { bird, price, ...product } of products) {
    const data = {
      ...product,
      birdId: birdIds.get(bird)!,
      priceCents: Math.round(price * 100),
    };
    await db.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: data,
    });
  }

  console.log(`Seeded ${birds.length} birds and ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
