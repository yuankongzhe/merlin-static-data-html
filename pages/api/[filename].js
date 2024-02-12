// pages/api/[filename].js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // 从查询参数中获取文件名
  const { filename } = req.query;
  
  // 定义JSON文件路径
  const jsonFilePath = path.join(process.cwd(), 'public', `${filename}.json`);
  
  // 读取JSON文件
  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ message: "Failed to read the file", error: err });
      return;
    }
    
    // 解析JSON数据
    const jsonData = JSON.parse(data);
    // 获取最后一个元素
    const lastEntry = jsonData[jsonData.length - 1];
    
    // 返回最后一个元素的数据
    res.status(200).json(lastEntry);
  });
}