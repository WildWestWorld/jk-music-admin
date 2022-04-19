
//用于文件的下载，最好和axios搭配使用，效果更加
export  const createDownLoadUrl=(fileContent,fileTotalName)=>{

    //content就是你下载的内容
    let content=fileContent

    //创建一个a标签
    let a = document.createElement('a');
    //创建一个用于下载的url 记得要是blob类型不然没法正常下载 注意这个content就是我们要下载的文件内容
    let url = window.URL.createObjectURL(new Blob([content],
        { type:"charset=" + ( 'utf-8') }));
    //将a标签的href设置为url
    a.href = url;
    //将a标签的download属性设置为我们想要的文件名即可
    a.download =  fileTotalName
    //然后我们设置一个a标签的click事件，这样就会开始下载了
    a.click();
    //销毁我们前面设置的a标签
    window.URL.revokeObjectURL(url);
}


