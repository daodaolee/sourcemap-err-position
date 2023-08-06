<script setup lang="ts">
import { Button, Form, FormItem, Input, InputNumber, Radio, RadioGroup, Textarea, Card } from 'ant-design-vue';
import { getConsumerOrigin } from './tools'
import { reactive } from 'vue';

interface FormState {
  type: number,
  maplink: string;
  mapcontent?: string;
  line: number;
  column: number;
  dir: string;
}

const formState = reactive<FormState>({
  type: 1,
  maplink: '', // http://127.0.0.1:8080/assets/index-e6a2cd70.js.map
  mapcontent: '',
  line: 1, // 1
  column: 1, //49402
  dir: '' // /Users/daodaolee/project/sourcemap
});

const onFinish = async (values: any) => {
  console.log('Success:', values);
  if(formState.type === 1) {
    const json = await fetch(formState.maplink, { mode: 'cors' })
    const result = await json.json()
    openVscode(result)
  }else{
    openVscode(formState.mapcontent)
  }
};

const _window = window as any
const openVscode = (result:any) => {
  _window?.sourceMap.SourceMapConsumer.with(result, null, async (consumer:any) => {
    const origin:any = await getConsumerOrigin(consumer, formState.line, formState.column)
    const pathname = await new URL(origin.source, import.meta.url).pathname
    await window.open(`vscode://file${formState.dir}${pathname}:${origin.line}:${origin.column}`)
  })
}

</script>

<template>
  <div class="main">
    <Card>
      <Form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
      >
        <FormItem name="remember" :wrapper-col="{ offset: 8, span: 16 }">
          <RadioGroup v-model:value="formState.type">
            <Radio :value="1">连接</Radio>
            <Radio :value="2">内容</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem
          v-if="formState.type === 1"
          label="map链接"
          name="maplink"
          :rules="[{ required: true, message: '请输入map链接' }]"
        >
          <Input v-model:value="formState.maplink" />
        </FormItem>

        <FormItem
          v-if="formState.type === 2"
          label="map内容"
          name="mapcontent"
          :rules="[{ required: true, message: '请输入map内容' }]"
        >
          <Textarea v-model:value="formState.mapcontent" />
        </FormItem>

        <FormItem
          label="line"
          name="line"
          :rules="[{ required: true, message: '请输入line' }]"
        >
          <InputNumber class="w100" v-model:value="formState.line" />
        </FormItem>

        <FormItem
          label="column"
          name="column"
          :rules="[{ required: true, message: '请输入column' }]"
        >
          <InputNumber class="w100" v-model:value="formState.column" />
        </FormItem>

        <FormItem
          label="绝对地址"
          name="dir"
          :rules="[{ required: true, message: '请输入项目绝对地址' }]"
        >
          <Input v-model:value="formState.dir" />
        </FormItem>

        <FormItem :wrapper-col="{ offset: 8, span: 16 }">
          <Button type="primary" html-type="submit">确定</Button>
        </FormItem>
      </Form>
    </Card>
  </div>

</template>

<style scoped>
.w100{
  width: 100%;
}
.main{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
