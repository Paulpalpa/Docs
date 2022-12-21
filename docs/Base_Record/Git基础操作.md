---
sidebar_position: 1
---
**工作区**：就是你在电脑里能看到的目录；

**版本库**：`git init`命令之后生成的`.git`，git的版本库中存了很多东西，其中最重要的就是成为stage的`暂存区`，还有git自动为我们创建的第一个分支`master`，以及指向master的一个指针`HEAD`
1. 创建一个空目录：learn-Git
2. 把这个目录变成git可以管理的仓库： `git init`
3. 新建文件添加到暂存区：`git add test.txt`
4. 把暂存区的内容提交到当前分支：`git commit -m "add: test.txt` （`git commit --no-verify -m "xxx"`跳过代码检查）
5. 查看仓库当前的状态：`git status`
6. 查看文件的修改前后对比：`git diff test.txt`
7. 查看从近到远的提交历史：`git log`   `git log --pretty=oneline`；查看每一次的命令历史：`git reflog`
8. 回退到上一个提交版本(git中HEAD表示当前版本，指向当前分支)：`git reset --hard HEAD^` (上上个版本 HEAD^^) `git reset --hard commit_id`
9. 查看工作区和版本库里文件最新版本的区别：`git diff HEAD -- test.txt`
10. 丢弃工作区的更改：`git checkout -- text.txt` 意思就是，把test.txt文件在工作区的修改全部撤销，这里有两种情况：①test.txt自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态；②test.txt已经添加到暂存区后，又作了修改，现在，撤销修改就回到添加到暂存区后的状态。总之，就是让这个文件回到最近一次git commit或git add时的状态。
11. 把暂存区的修改回退到工作区: `git reset HEAD test.txt`
12. 从版本库删除一个文件：`git rm test.txt`
-----
13. 添加远程仓库：（用本地已有的仓库和远程仓库进行关联，把本地的仓库的内容推送到远程）

    ①在 github新建一个仓库 `learn-git`

    ②将本地已有的仓库与之关联：`git remote add origin git@github.com:moxiewf/learn-git.git
`

    ③把本地仓库的所有内容推送到github的远程仓库上：`git push --set-upstream origin master；本地关联远程分支：`git branch --set-upstream-to=origin/remote_branch  local_branch`
`

14. 从远程仓库克隆：（本地没有仓库，直接从github上新建仓库）

     ①登录github新建一个仓库`git-skills`，勾选`Initialize this repository with a README`，这样GitHub会自动为我们创建一个README.md文件。创建完毕后，可以看到README.md文件：

     ②克隆一个本地仓库：`git clone git@github.com:moxiewf/git-skills.git`
     
-----
15. 创建+切换分支：`git checkout -b dev` （-b 参数表示创建并切换，相当于两个命令先后执行：`git branch dev` `git checkout dev`）；`git checkout -b dev origin/dev`（从远程origin的dev分支创建本地dev分支）
16. 新版的git提供了新的切换分支的命令：`git switch -c dev`（与`git checkout -b dev`效果一致，是为了不和之前提到的撤销修改命令`git checkout -- <file>`混淆，也更容易理解）
17. 查看分支：`git branch` （会列出所有分支，当前分支会标有一个*）
18. 合并指定分支代码到当前分支：`git merge dev`（合并dev代码到当前分支）
19. 删除本地dev分支：`git branch -d dev` （如果删除一个没有被合并过的分支需要加上`-D`参数强制删除 `git branch -D dev`） （建议在新分支上完成了任务后，合并代码到develop、master后即删除本地建的新分支）
20. 查看分支合并图：`git log --graph`
-----
21. 分支管理策略：

    ①通常合并分支时，如果可能，git会用`Fast forward`模式，但是在这种模式下，删除分支后会丢掉分支信息

    ②如果要强制禁用`Fast forward`模式，git就会在merge时产生一个新的commit，这样，从历史分支上就可以看出分支信息

    ③禁用`Fast forward`模式命令：`git merge --no-ff -m "merge with no-ff" dev`（`--no-ff`参数表示禁用`Fast forward`模式）

    ④分支策略：`master`分支应该是非常稳定的，也就是仅用来发布新版本，平时不能在上面干活；干活都在`develop`分支，也就是说`develop`分支是不稳定的，到某个时候，比如1.0版本发布时，再把`develop`分支合并到`master`上，在`master`分支发布1.0版本；你和你的小伙伴每个人都在`develop`分支干活，每个人都有自己的分支，时不时往`develop`上合并代码就可以了

-----
22. Bug分支：

    ①每个bug都可以通过一个新的临时分支来修复，修复后，合并分支，然后将临时分支删除
    
    ②首先确定要在哪个分支上修复bug，假如在`master`分支上修复，就从`master`分支上创建临时分支: `git checkout master` `git checkout -b hotfix-1`

    ③在`hotfix-1`分支修复好bug并提交后，切换到`master`分支完成合并：`git checkout master` `git merge --no-ff -m "merge bug fix 1" hotfix-1`

    ④合并完成后将临时分支删除：`git branch -d hotfix-1`
-----
23. 将工作现场隐藏起来：`git stash save`
24. 将工作现场恢复：`git stash pop`（恢复的同时把stash的内容也删除了）；`git stash apply <stash{xxx}>`（恢复的时候不会删除stash的内容，删除需要再执行命令`git stash drop`）
25. 查看隐藏的工作现场列表：`git stash list`
26. 复制一个特定的提交到当前分支：`git cherry-pick <commit_id>` （除了复制commit_id对应的那次提交外，也能将某个分支的最近一次提交复制 `git cherry-pick <branch_name>`；复制多个提交`git cherry-pick <HashA> <HashB>`）
27. 查看远程仓库的信息：`git remote` （或者用`git remote -v`查看更详细的信息，会显示可以fetch和push的origin地址，如果没有推送权限就看不到push的地址）
28. 推送分支：`git push <远程主机名> <本地分支名>:<远程分支名>`，如果本地分支名与远程分支名相同则可以写成`git push <远程主机名> <本地分支名>`；强制推送：`git push --force origin master`；删除远程分支：`git push origin --delete master`
29. 将提交历史整理成一条直线：`git rebase`
-----
30. 标签：切换到需要打标签的分支后执行`git tag <name>`；针对某次提交打tag`git tag <name> <commit_id>`（git tag -a v0.1 -m "version 0.1 released" 1094adb  -a指定标签名称 -m指定说明文字）； 查看标签信息`git show <tag_name>`
31. 配置git命令别名：`git config --global alias.st status`（以st表示status）`git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"` 配置Git的时候，加上`--global`是针对当前用户起作用的，如果不加，那只针对当前的仓库起作用。（如果要删除别名，删除.git/config文件中[alias]项中对应的配置即可）
-----
**修复线上bug操作流程**：比如在0.23.0的版本发现了bug，要基于这个版本对应的tag上新建一个分支hotfix-0.23.0，改好以后将hotfix-0.23.0的代码打一个新的tag，发布新的版本0.23.1。同时要将hotfix-0.23.0的代码合并到目前开发的分支，保持无老bug。


[git-简易教程](https://www.bootcss.com/p/git-guide/)

[廖雪峰Git教程](https://www.liaoxuefeng.com/wiki/896043488029600)

[git中文版](http://gitbook.liuhui998.com/index.html)

[git备忘单](https://gitee.com/liaoxuefeng/learn-java/raw/master/teach/git-cheatsheet.pdf)