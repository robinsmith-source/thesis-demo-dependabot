import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (process.env.VERCEL_ENV === "production") {
    console.log("Running in production mode, skipping seeding");
    return;
  }

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
            requiredUtensils: [
              "Large pot",
              "Skillet",
              "Bowl",
              "Wooden Spoon",
              "Colander",
            ],
            difficulty: "MEDIUM",
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
                        unit: "tsp",
                      },
                      {
                        name: "Spaghetti",
                        quantity: 300,
                        unit: "g",
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
                      unit: "g",
                    },
                  },
                },
                {
                  description:
                    "In a bowl, whisk the eggs, add the grated Parmesan, and mix well. Season with salt and pepper.",
                  stepType: "PREP",
                  duration: 3,
                  ingredients: {
                    create: [
                      {
                        name: "Eggs",
                        quantity: 2,
                      },
                      {
                        name: "Parmesan",
                        quantity: 100,
                        unit: "g",
                      },
                      {
                        name: "Salt",
                        quantity: 1,
                        unit: "tsp",
                      },
                      {
                        name: "Pepper",
                        quantity: 1,
                        unit: "tsp",
                      },
                    ],
                  },
                },
                {
                  description:
                    "Add the hot, drained spaghetti to the skillet with the bacon and mix.",
                  stepType: "PREP",
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
                      unit: "tbsp",
                    },
                  },
                },
                {
                  description:
                    "Serve and garnish with additional Parmesan if desired.",
                  stepType: "PREP",
                  duration: 1,
                  ingredients: {
                    create: {
                      name: "Parmesan",
                      quantity: 50,
                      unit: "g",
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
            requiredUtensils: [
              "Grill",
              "Salad Bowl",
              "Tongs",
              "Knife",
              "Cutting Board",
            ],
            difficulty: "EASY",
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
                      },
                      {
                        name: "Salt",
                        quantity: 1,
                        unit: "tsp",
                      },
                      {
                        name: "Pepper",
                        quantity: 1,
                        unit: "tsp",
                      },
                      {
                        name: "Olive Oil",
                        quantity: 2,
                        unit: "tbsp",
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
                        unit: "g",
                      },
                      {
                        name: "Cherry Tomatoes",
                        quantity: 200,
                        unit: "g",
                      },
                      {
                        name: "Cucumber",
                        quantity: 1,
                      },
                      {
                        name: "Red Onion",
                        quantity: 1,
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
                      unit: "tbsp",
                    },
                  },
                },
                {
                  description: "Serve the grilled chicken salad and enjoy.",
                  stepType: "PREP",
                  duration: 1,
                },
              ],
            },
          },
          {
            name: "Pasta Primavera",
            description:
              "A colorful pasta dish with fresh spring vegetables and a creamy sauce.",
            requiredUtensils: [
              "Large Pot",
              "Skillet",
              "Bowl",
              "Wooden Spoon",
              "Colander",
            ],
            difficulty: "MEDIUM",
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
                        unit: "tsp",
                      },
                      {
                        name: "Pasta",
                        quantity: 300,
                        unit: "g",
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
                        name: "Garlic",
                        quantity: 2,
                        unit: "cloves",
                      },
                      {
                        name: "Onion",
                        quantity: 1,
                      },
                      {
                        name: "Asparagus",
                        quantity: 200,
                        unit: "g",
                      },
                      {
                        name: "Bell Peppers",
                        quantity: 2,
                      },
                      {
                        name: "Cherry Tomatoes",
                        quantity: 250,
                        unit: "g",
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
                        unit: "ml",
                      },
                      {
                        name: "Parmesan",
                        quantity: 100,
                        unit: "g",
                      },
                      {
                        name: "Basil",
                        quantity: 2,
                        unit: "tbsp",
                      },
                      {
                        name: "Salt",
                        quantity: 1,
                        unit: "tsp",
                      },
                      {
                        name: "Pepper",
                        quantity: 1,
                        unit: "tsp",
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
                  stepType: "PREP",
                  duration: 1,
                },
              ],
            },
          },
          {
            name: "Classic Beef Stew",
            description:
              "A hearty and comforting beef stew with tender meat and a rich, flavorful broth.",
            requiredUtensils: [
              "Dutch Oven",
              "Knife",
              "Cutting Board",
              "Large Bowl",
              "Wooden Spoon",
            ],
            difficulty: "EXPERT",
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
                        unit: "kg",
                      },
                      {
                        name: "Flour",
                        quantity: 2,
                        unit: "tbsp",
                      },
                      {
                        name: "Salt",
                        quantity: 1,
                        unit: "tsp",
                      },
                      {
                        name: "Pepper",
                        quantity: 1,
                        unit: "tsp",
                      },
                      {
                        name: "Vegetable Oil",
                        quantity: 2,
                        unit: "tbsp",
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
                      },
                      {
                        name: "Carrots",
                        quantity: 3,
                      },
                      {
                        name: "Celery",
                        quantity: 3,
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
                        unit: "L",
                      },
                      {
                        name: "Tomato Paste",
                        quantity: 2,
                        unit: "tbsp",
                      },
                      {
                        name: "Red Wine",
                        quantity: 250,
                        unit: "ml",
                      },
                      {
                        name: "Thyme",
                        quantity: 1,
                        unit: "tsp",
                      },
                      {
                        name: "Bay Leaves",
                        quantity: 2,
                      },
                      {
                        name: "Worcestershire Sauce",
                        quantity: 2,
                        unit: "tsp",
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
                      unit: "g",
                    },
                  },
                },
                {
                  description:
                    "Serve the classic beef stew hot, garnished with fresh parsley.",
                  stepType: "PREP",
                  duration: 1,
                },
              ],
            },
          },
          {
            name: "Spaghetti Aglio e Olio",
            description:
              "A simple yet flavorful Italian pasta dish with garlic, olive oil, and red pepper flakes.",
            requiredUtensils: [
              "Large Pot",
              "Skillet",
              "Wooden Spoon",
              "Colander",
            ],
            difficulty: "EASY",
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
                        unit: "tsp",
                      },
                      {
                        name: "Spaghetti",
                        quantity: 300,
                        unit: "g",
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
                        unit: "tbsp",
                      },
                      {
                        name: "Garlic",
                        quantity: 4,
                        unit: "cloves",
                      },
                      {
                        name: "Red Pepper Flakes",
                        quantity: 1,
                        unit: "tsp",
                      },
                    ],
                  },
                },
                {
                  description:
                    "Toss the cooked spaghetti in the skillet with the garlic and oil mixture. Season with salt and pepper. Serve hot, garnished with chopped parsley.",
                  stepType: "PREP",
                  duration: 2,
                  ingredients: {
                    create: [
                      {
                        name: "Parsley",
                        quantity: 1,
                        unit: "tbsp",
                      },
                      {
                        name: "Salt",
                        quantity: 1,
                        unit: "tsp",
                      },
                      {
                        name: "Pepper",
                        quantity: 1,
                        unit: "tsp",
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
            requiredUtensils: [
              "Pizza Stone or Baking Sheet",
              "Rolling Pin",
              "Knife",
              "Cutting Board",
            ],
            difficulty: "EASY",
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
                      },
                      {
                        name: "Tomato Sauce",
                        quantity: 1,
                        unit: "cup",
                      },
                      {
                        name: "Fresh Mozzarella",
                        quantity: 200,
                        unit: "g",
                      },
                      {
                        name: "Tomato",
                        quantity: 2,
                      },
                      {
                        name: "Fresh Basil Leaves",
                        quantity: 1,
                        unit: "cup",
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
                      unit: "tbsp",
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
                  stepType: "PREP",
                  duration: 1,
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
