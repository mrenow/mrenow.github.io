<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const props = defineProps({
    msg: String
})
console.log(props.msg)

const count = ref(0)
const text = ref('')
const databaseContents = ref([])
const databaseLoaded = ref(false)

count.value = 100

const submitDatabase = async (attrib) => {
    const submitText = text.value
    text.value = ''
    console.log('data with ' + attrib + ' : ' + submitText)
    const { data, error } = await supabase
        .from('rubbish_table')
        .insert([{
            [attrib]: submitText
        }])
    console.log(data, error)
    getDatabase()
}

const getDatabase = async () => {
    const { data, error } = await supabase
        .from('rubbish_table')
        .select('*')
    console.log(data)
    databaseContents.value = data
    databaseLoaded.value = true
}

function yell () {
    console.log('YELLING')
}

onMounted(getDatabase)

</script>

<template>
  <p>
    Enter some text to enter the database below:
    {{ msg }}
  </p>
  <form
    class="flex-grow"
    @submit.prevent=""
  >
    <p>
      <label for="data_text">Data</label>
    </p>
    <textarea
      id="data_text"
      v-model="text"
    />
    <p>
      <input
        type="submit"
        value="data1"
        @click="submitDatabase('data1')"
      >
      <input
        type="submit"
        value="data2"
        @click="submitDatabase('data2')"
      >
    </p>
  </form>

  <p>
    Display database contents:
  </p>
  <button
    class="triangle-button"
    @click="yell"
  >
    Click me
  </button>
  <table v-if="databaseLoaded">
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
      <tr
        v-for="row in databaseContents"
        :key="row.id"
      >
        <th>{{ row.id }}</th>
        <th>{{ row.created_at }}</th>
        <th>{{ row.data1 }}</th>
        <th>{{ row.data2 }}</th>
        <th>{{ row.num }}</th>
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
button.round-button{
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
table{

}
button.triangle-button {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 90px 100vw 0 0;
  border-color: yellow transparent  ttransparentransparent;
}
</style>
