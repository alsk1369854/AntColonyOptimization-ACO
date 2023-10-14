### build

```bash
# 安裝打包工具
npm i gh-pages -save-d

# 更新 package.json
# {
#     ....
#     "homepage": "https://alsk1369854.github.io/AntColonyOptimization-ACO",
#     "scripts":{
#         ....
#         "predeploy": "npm run build",
#         "deploy": "gh-pages -d build"
#     }
# }

# 運行打包命令
npm run deploy

# 至 github pages 設定 > 分支 "gh-pages" 為預覽頁面
```
