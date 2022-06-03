// import { defineStore } from 'pinia'
// import { loadPost } from '../scripts/network'
// /*
// Intialize: title

// Mutate/expose: doAutosave,

// expose: isSaving, textMutated, content, resources 
// */

// const 

// // represents all the data needed for a blog post 
// export const useBlogEditor = defineStore('BlogEditor', {
//     state: () => ({
//         title: '',
//         content: '',
//         resources: [],
//         isSaving: false,
//         textMutated: 0
//     }),

//     actions:{
//         async swapTitle(title){
//             try {
//                 ({ content, resources } = await loadPost(title))
//             } catch (err) {
//                 console.log(err)
//                 if (err.message === NO_POST_ERR) {
//                     content = ''
//                 } else {
//                     throw err
//                 }
//             }

//         },

//     }

// })