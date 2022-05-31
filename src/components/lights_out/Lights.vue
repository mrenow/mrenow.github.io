<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../supabase'

const props = defineProps({
  msg: String
})
console.log(props.msg)

// const count = ref(0)
// const text = ref("")
// const databaseContents = ref([])
// const databaseLoaded = ref(false)

// count.value=100

const boardLoaded = ref(false)
const boardData = ref(new Map())

// const submitDatabase = async (attrib) => {
//   const submitText = text.value
//   text.value = ""
//   console.log("data with " + attrib + " : " + submitText)
//   const {data, error} = await supabase
//     .from("rubbish_table")
//     .insert([{
//       [attrib]: submitText
//     }])
//   console.log(data, error)
//   getDatabase()
// }

// const getDatabase = async () => {
//   const {data, error} = await supabase
//     .from("rubbish_table")
//     .select("*")
//   console.log(data)
//   databaseContents.value = data
//   databaseLoaded.value = true
// }


async function flipLight (row, col) {
  await supabase
    .rpc('flip_state', {row: row, col: col})
}

async function getLights () {
  const {data, error} = await supabase
    .from("states")
    .select("*")
  console.log(data)
  const lightmap = new Map();
  for (row in data) {
    lightmap.set({row: row.row, col: row.col}, row.state)
  }
  boardData.value = data
  boardLoaded.value = true
}



async function getID (row, col) {
  const {data, error} = await supabase
    .rpc('get_id', {row: row, col: col})
  console.log(data)
}

getID(1, 2)



// onMounted(getDatabase)

onMounted(getLights)


</script>

<template>
  <p>
  Enter some text to enter the database below:
  {{msg}}
  </p>
  <form @submit.prevent="">
    <p>
    <label for="data_text">Data</label>
    </p>
    <textarea
    id="data_text"
    v-model="text">
    </textarea>
    <p>
    <input
      type="submit"
      value="data1"
      @click="submitDatabase('data1')"
      />
    <input
      type="submit"
      value="data2"
      @click="submitDatabase('data2')"
      />
      </p>
    </form>

    <p>
      Display database contents:
    </p>
    <v-btn
      icon
      color="pink"
    >
      <v-icon>mdi-heart</v-icon>
    </v-btn>
    <button @click="getDatabase">
      Click me
    </button>
    <table v-if="boardLoaded">
      <thead>
        <tr>
          <th>id</th>
          <th>created_at</th>
          <th>data1</th>
          <th>data2</th>
          <th>num</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in boardData" :key="row.id">
          <th>{{row.id}}</th>
          <th>{{row.created_at}}</th>
          <th>{{row.data1}}</th>
          <th>{{row.data2}}</th>
          <th>{{row.num}}</th>
        </tr>
      </tbody>
    </table>
    <p v-else>
    Table loading...
    </p>
</template>

<style scoped>
a {
  color: #42b983;
}
table{

}
</style>

