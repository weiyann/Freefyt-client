// MyEditor 组件
import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

const MyEditor = ({ value, onChange }) => {
  const handleEditorChange = (content, editor) => {
    console.log('Content was updated:', content)

    // 将编辑器内容通过 onChange 回调传递给父组件
    onChange(content)
  }

  return (
    <Editor
      apiKey="71ct82inycq68ihv3xlnd12my854ruki9yzozlmrcf4kohxx"
      //調整
      //initialValue={value}  // 设置 initial value
      //增加
      value={value} // 使用 value 属性而不是 initialValue
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image',
          'charmap print preview anchor help',
          'searchreplace visualblocks code',
          'insertdatetime media table paste wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic | \
          alignleft aligncenter alignright | \
          bullist numlist outdent indent | \
          help',
        //增加
        readonly: false, // 允许编辑
      }}
      onEditorChange={handleEditorChange}
    />
  )
}

export default MyEditor
