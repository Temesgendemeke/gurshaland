gurshaland

blogs
// id
// title
// excerpt
// author
// date
// readtime: minute
// category: table
// image
// featured bool
// tag: table
// slug

content
- type: string
- text: string
- ingredients: string[]
- instructions: string[]



blog
- id
- title
- subtitle
- authoer
- date
- readtime: number
- category: relations
- tags
- image
- content: table
- slug



category
- name
- description
- color

comments
- author
- avater
- comment
- rating
- date
- likes

like

- post: unique
- user: uniuqe

recipe

- id
- title
- descripion
- image
- category: table
- difficulty
- time: strings
- servings: number
- rating: number
- reviews: reviews
- authoer: user
- tag: user defines
- prepTime: strings
- totalTime: strings
- likes: Like
- ingerdients
- culturalNote: sting

ingerdients
- item
- amount
- notes

instructions
- step: number
- title: string
- description: string
- time: string
- tips: strings

nutrition
- calories: number
- protein: string
- carbs: string
- fat: string
- fiber: string

author
- recipes
- blogs
- username
- full name
- password
- avater
- bio
