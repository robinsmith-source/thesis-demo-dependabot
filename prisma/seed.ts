import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await seedRecipeLabels();
  if (process.env.VERCEL_ENV !== "production") {
    await seedUserRecipes();
    await seedEasterEgg();
  }
}

async function seedRecipeLabels() {
  await prisma.recipeLabelCategory.upsert({
    where: { name: "Cuisine" },
    update: {},
    create: {
      name: "Cuisine",
      RecipeLabel: {
        create: [
          {
            name: "American",
          },
          {
            name: "German",
          },
          {
            name: "Chinese",
          },
          {
            name: "French",
          },
          {
            name: "Indian",
          },
          {
            name: "Italian",
          },
          {
            name: "Japanese",
          },
          {
            name: "Mexican",
          },
          {
            name: "Thai",
          },
          {
            name: "Vietnamese",
          },
        ],
      },
    },
  });

  await prisma.recipeLabelCategory.upsert({
    where: { name: "Diet" },
    update: {},
    create: {
      name: "Diet",
      RecipeLabel: {
        create: [
          {
            name: "Gluten-Free",
          },
          {
            name: "Keto",
          },
          {
            name: "Low-Carb",
          },
          {
            name: "Low-Fat",
          },
          {
            name: "Paleo",
          },
          {
            name: "Vegan",
          },
          {
            name: "Vegetarian",
          },
        ],
      },
    },
  });
}

async function seedEasterEgg() {
  await prisma.user.upsert({
    where: { email: "tobiasJordine@example.com" },
    update: {},
    create: {
      name: "Tobias Jordine",
      email: "tobiasJordine@example.com",
      emailVerified: new Date(),
      image:
        "https://utfs.io/f/4eb2c611-e9dd-42a6-8ab5-220b07fe8ebb-1xlmb4.png",
      recipes: {
        create: [
          {
            name: "UML Glühwein",
            description:
              "JA HALLO. Heut gibt's noch nen kleinen Tipp, wie man ganz einfach des Hausmacher EHHH Glühwein Rezept machen kann - FÜR INFORMATIKER!!!! " +
              "Deswegen machen wa des ganze in UML",
            difficulty: "MEDIUM",
            images: [
              "e8b55680-bc74-49a8-b869-22e92e98a998-1nq2cb.png",
              "41ddc442-6796-4023-bd5f-c512f9d08257-1nq2cb.png",
            ],
            labels: {
              connect: [
                {
                  name: "German",
                },
                {
                  name: "Paleo",
                },
              ],
            },
            tags: ["oldme", "life", "cooking", "bff", "friends", "together"],
            steps: {
              create: [
                {
                  description:
                    "Topf ist immer nicht schlecht. Topf - Des finde ich auch eine gute Sache.",
                  stepType: "PREP",
                  duration: 1,
                },
                {
                  description:
                    "Ja was brauchen wir dann noch? Vielleicht ein Herd oder. Machen wir noch ein Herd dazu - JAA IST GUT " +
                    "Das ganze muss ja auch warm sein. Name ist Programm!",
                  stepType: "PREP",
                  duration: 1,
                },
                {
                  description:
                    "Aber jetzt fehlt uns noch unsere Zutaten oder? Und wir machens ganz einfach oder? - Ja auf ganz schnell - Ja wir nehmen nen Tetrapack Glühwein.",
                  stepType: "PREP",
                  duration: 1,
                  ingredients: {
                    create: {
                      name: "TetraPack",
                      quantity: 1,
                      unit: "PIECE",
                    },
                  },
                },
                {
                  description: "Wir rufen die Methode 'schütt' von Topf auf",
                  stepType: "MIX",
                  duration: 1,
                },
                {
                  description: "Und setz auf Herd oder sowas in der Richtung",
                  stepType: "COOK",
                  duration: 10,
                },
                {
                  description:
                    "So des lassen wir's mal zur Vereinfachung und Zack fertig ist der Glühwein. Bitte schreibt uns in die Kommentare, wie's geklappt hat. Viel Spaß damit!",
                  stepType: "SERVE",
                  duration: 2,
                },
              ],
            },
          },
          {
            name: "Nikolaus Gewinnspiel",
            description:
              "Hallo Liebe Freunde und Freundinnen der Informatik - HOHOHO. Heute Willkommen beim MM und MI Homeshopping Center! uNd CsM iSt aUcH dAbEi!!! " +
              "Bei und gibt es Gewinne Gewinne heutzutage zum Nikolaus. Und wir haben da eine kleine Frage vorbereitet, weil ohne Frage auch keine Preise! Und der Preis ist Heiß, der Heiß ist Preis",
            difficulty: "HARD",
            images: [
              "4c505332-8a25-4b03-bfc9-170d3220223f-1nq2cb.png",
              "40af2fd7-5166-45b5-ace6-ac091396e932-1nq2cb.png",
              "691ebba0-34f9-4d1e-aff9-6b0b0c541e3e-1nq2cb.png",
            ],
            labels: {
              connect: [
                {
                  name: "German",
                },
                {
                  name: "Paleo",
                },
              ],
            },
            tags: ["q&a", "20 facts about me", "tooRich", "giveaway"],
            steps: {
              create: [
                {
                  description: "Wer hat Minix erfunden?",
                  stepType: "PREP",
                  duration: 2,
                  ingredients: {
                    create: [
                      {
                        name: "Andrew Reindeer",
                        quantity: 1,
                        unit: "PIECE",
                      },
                      {
                        name: "Andrew Tanenbaum",
                        quantity: 1,
                        unit: "PIECE",
                      },
                      {
                        name: "Andrew Santaclaus",
                        quantity: 1,
                        unit: "PIECE",
                      },
                    ],
                  },
                },
                {
                  description:
                    "Jetzt anrufen unter der Nummer 0800 900 800 oder in die Kommentare, je nachdem was einfacher ist.",
                  stepType: "SERVE",
                  duration: 5,
                },
              ],
            },
          },
        ],
      },
    },
  });
}

async function seedUserRecipes() {
  await prisma.user.upsert({
    where: { email: "testUser@example.com" },
    update: {},
    create: {
      name: "testUser",
      email: "testUser@example.com",
      emailVerified: new Date(),
      image: "https://placekitten.com/200/200",
      recipes: {
        create: [
          {
            name: "Spaghetti Carbonara",
            description:
              "A classic Italian pasta dish with creamy egg sauce and crispy bacon.",
            difficulty: "MEDIUM",
            images: [
              "68e9d0e2-c9ce-4c26-9f0a-ed11384877fc-65xcwy.jpg",
              "77695835-b0b3-4d71-8159-0e4a413b09d0-ytip1d.jpg",
            ],
            labels: {
              connect: [
                {
                  name: "Italian",
                },
              ],
            },
            tags: ["Creamy", "Pasta", "Family Favorite"],
            steps: {
              create: [
                {
                  description:
                    "Bring water to a boil in a large pot and cook the spaghetti until al dente as indicated on the package. Drain and set aside.",
                  stepType: "COOK",
                  duration: 10,
                  ingredients: {
                    create: [
                      {
                        name: "Salt",
                        quantity: 1,
                        unit: "TABLESPOON",
                      },
                      {
                        name: "Spaghetti",
                        quantity: 300,
                        unit: "GRAM",
                      },
                    ],
                  },
                },
                {
                  description:
                    "In a skillet, sauté the diced bacon over medium heat until it becomes crispy. Drain any excess fat.",
                  stepType: "COOK",
                  duration: 5,
                  ingredients: {
                    create: {
                      name: "Bacon",
                      quantity: 150,
                      unit: "GRAM",
                    },
                  },
                },
                {
                  description:
                    "In a bowl, whisk the eggs, add the grated Parmesan, and mix well. Season with salt and pepper.",
                  stepType: "MIX",
                  duration: 3,
                  ingredients: {
                    create: [
                      {
                        name: "Eggs",
                        quantity: 2,
                        unit: "PIECE",
                      },
                      {
                        name: "Parmesan",
                        quantity: 100,
                        unit: "GRAM",
                      },
                      {
                        name: "Salt",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                      {
                        name: "Pepper",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                    ],
                  },
                },
                {
                  description:
                    "Add the hot, drained spaghetti to the skillet with the bacon and mix.",
                  stepType: "MIX",
                  duration: 2,
                },
                {
                  description:
                    "Pour the egg-cheese mixture over the spaghetti and immediately toss well. The egg will turn into a creamy sauce due to the residual heat of the pasta.",
                  stepType: "COOK",
                  duration: 2,
                },
                {
                  description:
                    "Add a little pasta cooking water if needed to achieve the desired consistency.",
                  stepType: "COOK",
                  duration: 1,
                },
                {
                  description:
                    "Season with salt and pepper, and drizzle with a bit of olive oil.",
                  stepType: "PREP",
                  duration: 1,
                  ingredients: {
                    create: {
                      name: "Olive Oil",
                      quantity: 1,
                      unit: "TABLESPOON",
                    },
                  },
                },
                {
                  description:
                    "Serve and garnish with additional Parmesan if desired.",
                  stepType: "SERVE",
                  duration: 1,
                  ingredients: {
                    create: {
                      name: "Parmesan",
                      quantity: 50,
                      unit: "GRAM",
                    },
                  },
                },
              ],
            },
          },
          {
            name: "Grilled Chicken Salad",
            description:
              "A healthy and delicious salad with grilled chicken and fresh veggies.",
            difficulty: "EASY",
            images: ["43f0b4f6-1c40-48a7-a340-7a890848a36b-1d4zl3.jpg"],
            labels: {
              connect: [
                {
                  name: "Gluten-Free",
                },
                {
                  name: "Low-Carb",
                },
              ],
            },
            tags: ["Light Meal", "Summer Salad", "Grilled"],
            steps: {
              create: [
                {
                  description: "Preheat the grill to medium-high heat.",
                  stepType: "PREP",
                  duration: 10,
                },
                {
                  description:
                    "Season chicken breasts with salt, pepper, and olive oil. Grill for 6-8 minutes per side or until cooked through. Let them rest for a few minutes, then slice.",
                  stepType: "COOK",
                  duration: 15,
                  ingredients: {
                    create: [
                      {
                        name: "Chicken Breasts",
                        quantity: 2,
                        unit: "PIECE",
                      },
                      {
                        name: "Salt",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                      {
                        name: "Pepper",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                      {
                        name: "Olive Oil",
                        quantity: 2,
                        unit: "TABLESPOON",
                      },
                    ],
                  },
                },
                {
                  description:
                    "In a salad bowl, combine mixed greens, cherry tomatoes, cucumber, and red onion.",
                  stepType: "PREP",
                  duration: 5,
                  ingredients: {
                    create: [
                      {
                        name: "Mixed Greens",
                        quantity: 150,
                        unit: "GRAM",
                      },
                      {
                        name: "Cherry Tomatoes",
                        quantity: 200,
                        unit: "GRAM",
                      },
                      {
                        name: "Cucumber",
                        quantity: 1,
                        unit: "PIECE",
                      },
                      {
                        name: "Red Onion",
                        quantity: 1,
                        unit: "PIECE",
                      },
                    ],
                  },
                },
                {
                  description:
                    "Add the sliced grilled chicken to the salad. Drizzle with balsamic vinaigrette and toss well.",
                  stepType: "PREP",
                  duration: 2,
                  ingredients: {
                    create: {
                      name: "Balsamic Vinaigrette",
                      quantity: 3,
                      unit: "TABLESPOON",
                    },
                  },
                },
                {
                  description: "Serve the grilled chicken salad and enjoy.",
                  stepType: "SERVE",
                  duration: 1,
                },
              ],
            },
          },
          {
            name: "Pasta Primavera",
            description:
              "A colorful pasta dish with fresh spring vegetables and a creamy sauce.",
            difficulty: "MEDIUM",
            images: ["6fe2c4a2-b4ea-4738-9c78-6c0503f8d44b-4sbvj9.jpg"],
            labels: {
              connect: [
                {
                  name: "Italian",
                },
                {
                  name: "Vegetarian",
                },
              ],
            },
            tags: [
              "Spring Dish",
              "Vegetable Pasta",
              "Colorful",
              "Weeknight Dinner",
            ],
            steps: {
              create: [
                {
                  description:
                    "Cook the pasta in a large pot of salted boiling water until al dente. Drain and set aside.",
                  stepType: "COOK",
                  duration: 10,
                  ingredients: {
                    create: [
                      {
                        name: "Salt",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                      {
                        name: "Pasta",
                        quantity: 300,
                        unit: "GRAM",
                      },
                    ],
                  },
                },
                {
                  description:
                    "In a skillet, sauté garlic and onion in olive oil until softened. Add asparagus, bell peppers, and cherry tomatoes. Cook until tender-crisp.",
                  stepType: "COOK",
                  duration: 7,
                  ingredients: {
                    create: [
                      {
                        name: "Garlic cloves",
                        quantity: 2,
                        unit: "PIECE",
                      },
                      {
                        name: "Onion",
                        quantity: 1,
                        unit: "PIECE",
                      },
                      {
                        name: "Asparagus",
                        quantity: 200,
                        unit: "GRAM",
                      },
                      {
                        name: "Bell Peppers",
                        quantity: 2,
                        unit: "PIECE",
                      },
                      {
                        name: "Cherry Tomatoes",
                        quantity: 250,
                        unit: "GRAM",
                      },
                    ],
                  },
                },
                {
                  description:
                    "In a bowl, mix cream, grated Parmesan, and basil. Season with salt and pepper.",
                  stepType: "PREP",
                  duration: 3,
                  ingredients: {
                    create: [
                      {
                        name: "Heavy Cream",
                        quantity: 150,
                        unit: "MILLILITER",
                      },
                      {
                        name: "Parmesan",
                        quantity: 100,
                        unit: "GRAM",
                      },
                      {
                        name: "Basil",
                        quantity: 2,
                        unit: "TABLESPOON",
                      },
                      {
                        name: "Salt",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                      {
                        name: "Pepper",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                    ],
                  },
                },
                {
                  description:
                    "Add the cooked pasta and the cream sauce to the skillet with the vegetables. Toss well to combine.",
                  stepType: "PREP",
                  duration: 2,
                },
                {
                  description:
                    "Serve the pasta primavera with a sprinkle of extra Parmesan and fresh basil leaves.",
                  stepType: "SERVE",
                  duration: 1,
                },
              ],
            },
          },
          {
            name: "Classic Beef Stew",
            description:
              "A hearty and comforting beef stew with tender meat and a rich, flavorful broth.",
            difficulty: "EXPERT",
            images: ["28603a4a-8af8-4280-8735-a0917c4ede08-hdo5gh.jpg"],
            labels: {
              connect: [
                {
                  name: "American",
                },
              ],
            },
            tags: [
              "Slow Cooked",
              "Winter Comfort",
              "Family Favorite",
              "One-Pot Meal",
            ],
            steps: {
              create: [
                {
                  description:
                    "In a large bowl, toss cubed beef with flour, salt, and pepper. In a Dutch oven, heat oil over medium-high heat. Brown the beef in batches, then set it aside.",
                  stepType: "COOK",
                  duration: 15,
                  ingredients: {
                    create: [
                      {
                        name: "Beef Stew Meat",
                        quantity: 1,
                        unit: "KILOGRAM",
                      },
                      {
                        name: "Flour",
                        quantity: 2,
                        unit: "TABLESPOON",
                      },
                      {
                        name: "Salt",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                      {
                        name: "Pepper",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                      {
                        name: "Vegetable Oil",
                        quantity: 2,
                        unit: "TABLESPOON",
                      },
                    ],
                  },
                },
                {
                  description:
                    "Add chopped onions, carrots, and celery to the Dutch oven. Sauté until they start to soften. Return the browned beef to the pot.",
                  stepType: "COOK",
                  duration: 5,
                  ingredients: {
                    create: [
                      {
                        name: "Onions",
                        quantity: 2,
                        unit: "PIECE",
                      },
                      {
                        name: "Carrots",
                        quantity: 3,
                        unit: "PIECE",
                      },
                      {
                        name: "Celery",
                        quantity: 3,
                        unit: "PIECE",
                      },
                    ],
                  },
                },
                {
                  description:
                    "Stir in beef broth, tomato paste, and red wine. Season with thyme, bay leaves, and Worcestershire sauce. Bring to a boil, then reduce heat and simmer for 2-3 hours.",
                  stepType: "COOK",
                  duration: 180,
                  ingredients: {
                    create: [
                      {
                        name: "Beef Broth",
                        quantity: 1,
                        unit: "LITER",
                      },
                      {
                        name: "Tomato Paste",
                        quantity: 2,
                        unit: "TABLESPOON",
                      },
                      {
                        name: "Red Wine",
                        quantity: 250,
                        unit: "MILLILITER",
                      },
                      {
                        name: "Thyme",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                      {
                        name: "Bay Leaves",
                        quantity: 2,
                        unit: "PIECE",
                      },
                      {
                        name: "Worcestershire Sauce",
                        quantity: 2,
                        unit: "TEASPOON",
                      },
                    ],
                  },
                },
                {
                  description:
                    "Add diced potatoes and simmer for an additional 30-45 minutes until the beef and vegetables are tender. Adjust seasoning as needed.",
                  stepType: "COOK",
                  duration: 45,
                  ingredients: {
                    create: {
                      name: "Potatoes",
                      quantity: 500,
                      unit: "GRAM",
                    },
                  },
                },
                {
                  description:
                    "Serve the classic beef stew hot, garnished with fresh parsley.",
                  stepType: "SERVE",
                  duration: 1,
                },
              ],
            },
          },
          {
            name: "Spaghetti Aglio e Olio",
            description:
              "A simple yet flavorful Italian pasta dish with garlic, olive oil, and red pepper flakes.",
            difficulty: "EASY",
            images: ["997060aa-6806-4971-b4c9-9ae5556e54a1-gbxcxj.jpg"],
            labels: {
              connect: [
                {
                  name: "Italian",
                },
                {
                  name: "Vegetarian",
                },
              ],
            },
            tags: [
              "Classic",
              "Garlic Lovers",
              "Easy Dinner",
              "Weeknight Pasta",
            ],
            steps: {
              create: [
                {
                  description:
                    "Cook the spaghetti in a large pot of salted boiling water until al dente. Drain and set aside.",
                  stepType: "COOK",
                  duration: 10,
                  ingredients: {
                    create: [
                      {
                        name: "Salt",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                      {
                        name: "Spaghetti",
                        quantity: 300,
                        unit: "GRAM",
                      },
                    ],
                  },
                },
                {
                  description:
                    "In a skillet, heat olive oil over medium heat. Add minced garlic and red pepper flakes. Sauté for 2-3 minutes until fragrant.",
                  stepType: "COOK",
                  duration: 3,
                  ingredients: {
                    create: [
                      {
                        name: "Olive Oil",
                        quantity: 4,
                        unit: "TABLESPOON",
                      },
                      {
                        name: "Garlic cloves",
                        quantity: 4,
                        unit: "PIECE",
                      },
                      {
                        name: "Red Pepper Flakes",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                    ],
                  },
                },
                {
                  description:
                    "Toss the cooked spaghetti in the skillet with the garlic and oil mixture. Season with salt and pepper. Serve hot, garnished with chopped parsley.",
                  stepType: "SEASON",
                  duration: 2,
                  ingredients: {
                    create: [
                      {
                        name: "Parsley",
                        quantity: 1,
                        unit: "TABLESPOON",
                      },
                      {
                        name: "Salt",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                      {
                        name: "Pepper",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Homemade Margherita Pizza",
            description:
              "A classic and simple Italian pizza with fresh tomatoes, mozzarella, basil, and olive oil.",
            difficulty: "EASY",
            images: ["52d9b13f-a267-4947-8dba-2ae9ab574375-hsmvrm.webp"],
            labels: {
              connect: [
                {
                  name: "Italian",
                },
                {
                  name: "Vegetarian",
                },
              ],
            },
            tags: [
              "Margherita",
              "Homemade Pizza",
              "Fresh Ingredients",
              "Family Favorite",
            ],
            steps: {
              create: [
                {
                  description:
                    "Preheat the oven with a pizza stone (if available) to the highest temperature (usually around 500°F or 260°C).",
                  stepType: "PREP",
                  duration: 15,
                },
                {
                  description:
                    "Roll out the pizza dough on a floured surface to your desired thickness. Transfer it to a pizza stone or baking sheet lined with parchment paper.",
                  stepType: "PREP",
                  duration: 10,
                },
                {
                  description:
                    "Spread a thin layer of tomato sauce on the pizza dough. Top with slices of fresh mozzarella, tomato slices, and fresh basil leaves.",
                  stepType: "PREP",
                  duration: 5,
                  ingredients: {
                    create: [
                      {
                        name: "Pizza Dough",
                        quantity: 1,
                        unit: "PIECE",
                      },
                      {
                        name: "Tomato Sauce",
                        quantity: 1,
                        unit: "CUP",
                      },
                      {
                        name: "Fresh Mozzarella",
                        quantity: 200,
                        unit: "GRAM",
                      },
                      {
                        name: "Tomato",
                        quantity: 2,
                        unit: "PIECE",
                      },
                      {
                        name: "Fresh Basil Leaves",
                        quantity: 1,
                        unit: "CUP",
                      },
                    ],
                  },
                },
                {
                  description:
                    "Drizzle olive oil over the pizza and season with salt and pepper.",
                  stepType: "PREP",
                  duration: 2,
                  ingredients: {
                    create: {
                      name: "Olive Oil",
                      quantity: 2,
                      unit: "TABLESPOON",
                    },
                  },
                },
                {
                  description:
                    "Bake the pizza in the preheated oven for 10-12 minutes, or until the crust is golden and the cheese is bubbly and slightly browned.",
                  stepType: "COOK",
                  duration: 12,
                },
                {
                  description:
                    "Slice the homemade Margherita pizza and serve hot.",
                  stepType: "SERVE",
                  duration: 1,
                },
              ],
            },
          },
          {
            name: "Vegetarian Stir-Fry",
            description:
              "A quick and healthy vegetarian stir-fry with a colorful mix of vegetables and tofu.",
            difficulty: "EASY",
            images: ["b3940c1c-5142-407f-b80f-e4010415ac87-nt79li.webp"],
            labels: {
              connect: [
                {
                  name: "Vegetarian",
                },
              ],
            },
            tags: [
              "Quick Meal",
              "Meatless Monday",
              "Asian Inspired",
              "Colorful",
            ],
            steps: {
              create: [
                {
                  description:
                    "Heat a wok or large skillet over medium-high heat. Add a tablespoon of vegetable oil.",
                  stepType: "PREP",
                  duration: 5,
                  ingredients: {
                    create: [
                      {
                        name: "Vegetable Oil",
                        quantity: 1,
                        unit: "TABLESPOON",
                      },
                    ],
                  },
                },
                {
                  description:
                    "Add diced tofu to the hot wok and stir-fry until golden brown on all sides.",
                  stepType: "COOK",
                  duration: 8,
                  ingredients: {
                    create: [
                      {
                        name: "Tofu",
                        quantity: 200,
                        unit: "GRAM",
                      },
                    ],
                  },
                },
                {
                  description:
                    "Add a mix of colorful vegetables, such as bell peppers, broccoli, and snap peas. Stir-fry until the vegetables are tender-crisp.",
                  stepType: "COOK",
                  duration: 5,
                  ingredients: {
                    create: [
                      {
                        name: "Bell Peppers",
                        quantity: 1,
                        unit: "PIECE",
                      },
                      {
                        name: "Broccoli Florets",
                        quantity: 1,
                        unit: "CUP",
                      },
                      {
                        name: "Snap Peas",
                        quantity: 1,
                        unit: "CUP",
                      },
                    ],
                  },
                },
                {
                  description:
                    "In a small bowl, mix soy sauce, sesame oil, and a pinch of sugar. Pour the sauce over the stir-fry and toss to combine.",
                  stepType: "MIX",
                  duration: 3,
                  ingredients: {
                    create: [
                      {
                        name: "Soy Sauce",
                        quantity: 2,
                        unit: "TABLESPOON",
                      },
                      {
                        name: "Sesame Oil",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                      {
                        name: "Sugar",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                    ],
                  },
                },
                {
                  description:
                    "Serve the vegetarian stir-fry over cooked rice or noodles. Garnish with chopped green onions and sesame seeds.",
                  stepType: "SERVE",
                  duration: 3,
                  ingredients: {
                    create: [
                      {
                        name: "Green Onions",
                        quantity: 2,
                        unit: "TABLESPOON",
                      },
                      {
                        name: "Sesame Seeds",
                        quantity: 1,
                        unit: "TEASPOON",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Fruit Smoothie",
            description: "A refreshing and easy-to-make fruit smoothie.",
            difficulty: "EASY",
            images: ["0304f9a7-93e4-45c6-aafb-83ddd3b536f1-gumhj9.jpg"],
            labels: {
              connect: [{ name: "Vegan" }, { name: "Gluten-Free" }],
            },
            steps: {
              create: [
                {
                  description:
                    "Blend together your favorite fruits with yogurt and ice cubes.",
                  stepType: "MIX",
                  duration: 5,
                  ingredients: {
                    create: [
                      { name: "Assorted Fruits", quantity: 300, unit: "GRAM" },
                      { name: "Yogurt", quantity: 500, unit: "GRAM" },
                      { name: "Ice Cubes", quantity: 10, unit: "PIECE" },
                    ],
                  },
                },
                {
                  description: "Pour into a glass and enjoy!",
                  stepType: "SERVE",
                  duration: 2,
                },
              ],
            },
          },
          {
            name: "Beef Stir-Fry with Broccoli",
            description:
              "A savory beef stir-fry with fresh broccoli and a flavorful sauce.",
            difficulty: "MEDIUM",
            images: ["d83a911c-bc2f-43ba-b0e1-11d295754f42-wxk4uu.jpg"],
            labels: {
              connect: [{ name: "Chinese" }],
            },
            steps: {
              create: [
                {
                  description:
                    "Slice beef thinly and marinate in soy sauce and cornstarch.",
                  stepType: "PREP",
                  duration: 20,
                  ingredients: {
                    create: [
                      { name: "Beef", quantity: 300, unit: "GRAM" },
                      { name: "Soy Sauce", quantity: 2, unit: "TABLESPOON" },
                      { name: "Cornstarch", quantity: 1, unit: "TABLESPOON" },
                    ],
                  },
                },
                {
                  description:
                    "Blanch broccoli in boiling water. Drain and set aside.",
                  stepType: "COOK",
                  duration: 5,
                  ingredients: {
                    create: [{ name: "Broccoli", quantity: 1, unit: "CUP" }],
                  },
                },
                {
                  description:
                    "Stir-fry marinated beef until browned. Add broccoli and sauce.",
                  stepType: "COOK",
                  duration: 10,
                  ingredients: {
                    create: [
                      { name: "Sauce", quantity: 1, unit: "CUP" },
                      {
                        name: "Additional Ingredients",
                        quantity: 1,
                        unit: "PIECE",
                      },
                    ],
                  },
                },
                {
                  description: "Serve over rice and garnish with sesame seeds.",
                  stepType: "SERVE",
                  duration: 3,
                  ingredients: {
                    create: [
                      { name: "Sesame Seeds", quantity: 1, unit: "TEASPOON" },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Avocado Toast with Poached Egg",
            description:
              "A trendy and satisfying snack featuring creamy avocado on toasted bread with a perfectly poached egg.",
            difficulty: "MEDIUM",
            images: ["036f15ca-478b-42c0-a300-b6eb196beb99-v6kb4n.jpg"],
            labels: {
              connect: [{ name: "Low-Fat" }, { name: "Vegetarian" }],
            },
            tags: ["Quick Breakfast", "Brunch"],
            steps: {
              create: [
                {
                  description:
                    "Toast slices of whole-grain bread until golden brown.",
                  stepType: "COOK",
                  duration: 5,
                  ingredients: {
                    create: [
                      { name: "Whole-Grain Bread", quantity: 2, unit: "PIECE" },
                    ],
                  },
                },
                {
                  description:
                    "Mash ripe avocado and spread it onto the toasted bread slices.",
                  stepType: "PREP",
                  duration: 5,
                  ingredients: {
                    create: [
                      { name: "Ripe Avocado", quantity: 1, unit: "PIECE" },
                    ],
                  },
                },
                {
                  description:
                    "Poach eggs until the whites are set but the yolks remain runny.",
                  stepType: "COOK",
                  duration: 4,
                  ingredients: {
                    create: [{ name: "Eggs", quantity: 2, unit: "PIECE" }],
                  },
                },
                {
                  description:
                    "Place a poached egg on each avocado toast. Season with salt and pepper.",
                  stepType: "SEASON",
                  duration: 3,
                  ingredients: {
                    create: [
                      { name: "Salt", quantity: 1, unit: "TEASPOON" },
                      { name: "Pepper", quantity: 1, unit: "TEASPOON" },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: "Caprese Skewers",
            description:
              "A refreshing and bite-sized snack with cherry tomatoes, fresh mozzarella, and basil.",
            difficulty: "EASY",
            images: ["92a355f5-e44b-4da2-afba-26998e665170-lrlsg9.jpg"],
            labels: {
              connect: [{ name: "Italian" }, { name: "Vegetarian" }],
            },
            tags: ["Appetizer", "Quick Bite"],
            steps: {
              create: [
                {
                  description:
                    "Thread one cherry tomato, one mozzarella ball, and one basil leaf onto each skewer.",
                  stepType: "PREP",
                  duration: 10,
                  ingredients: {
                    create: [
                      { name: "Cherry Tomatoes", quantity: 20, unit: "PIECE" },
                      {
                        name: "Fresh Mozzarella Balls",
                        quantity: 20,
                        unit: "PIECE",
                      },
                      {
                        name: "Fresh Basil Leaves",
                        quantity: 20,
                        unit: "PIECE",
                      },
                      {
                        name: "Balsamic Glaze",
                        quantity: 1,
                        unit: "TABLESPOON",
                      },
                    ],
                  },
                },
                {
                  description: "Drizzle with balsamic glaze before serving.",
                  stepType: "SERVE",
                  duration: 2,
                },
              ],
            },
          },
          {
            name: "Hummus and Veggie Wraps",
            description:
              "A healthy and satisfying snack with whole wheat wraps, hummus, and colorful vegetables.",
            difficulty: "EASY",
            images: ["ebe59729-80a7-4d81-914d-40e6f215d628-69wfh8.jpg"],
            labels: {
              connect: [{ name: "Vegetarian" }, { name: "Low-Fat" }],
            },
            tags: ["Quick Lunch", "On-the-go"],
            steps: {
              create: [
                {
                  description:
                    "Spread a generous layer of hummus on a whole wheat wrap.",
                  stepType: "PREP",
                  duration: 3,
                  ingredients: {
                    create: [
                      { name: "Hummus", quantity: 4, unit: "TABLESPOON" },
                      { name: "Whole Wheat Wrap", quantity: 1, unit: "PIECE" },
                    ],
                  },
                },
                {
                  description:
                    "Add sliced cucumbers, cherry tomatoes, red bell peppers, and spinach leaves.",
                  stepType: "PREP",
                  duration: 5,
                  ingredients: {
                    create: [
                      { name: "Cucumbers", quantity: 1, unit: "PIECE" },
                      { name: "Cherry Tomatoes", quantity: 1, unit: "PIECE" },
                      { name: "Red Bell Peppers", quantity: 1, unit: "PIECE" },
                      { name: "Spinach Leaves", quantity: 500, unit: "GRAM" },
                    ],
                  },
                },
                {
                  description:
                    "Roll up the wrap tightly and slice into bite-sized pieces.",
                  stepType: "PREP",
                  duration: 3,
                },
                {
                  description: "Secure with toothpicks and serve.",
                  stepType: "SERVE",
                  duration: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
