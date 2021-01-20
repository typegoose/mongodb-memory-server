
## Commit Structure

This Repository uses the [Angular Commit Message Format](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)
This format is used by `semantic-release` to automatically release new versions based on changes

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```txt
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer than 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header
of the reverted commit.
In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit
being reverted.

### Type

Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing or correcting existing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation
* **revert**: Revert an commit
* **dependencies**: Update field `dependencies` (/ `devDependencies`)
* **release**: A Release Commit

look into [releaserc](../.releaserc.js) for corresponding versions

### Scope

The scope could be anything specifying place of the commit change. For example `$location`,
`$browser`, `$compile`, `$rootScope`, `ngHref`, `ngClick`, `ngView`, etc...

You can use `*` when the change affects more than a single scope.

### Subject

The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit closes

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines.
The rest of the commit message is then used for this.

## Branch Structure

### master branch

The `master` branch is the release branch.

It has the following protection rules:

* `linear-history`: Requires linear-history, meaning no merge-commits
* `status-checks`: All required status checks must pass before being able to merge (Currently required: `tests (12.x)`)
* `branches-up-to-date`: The Branches must be up-to-date before being able to merge into `master`

### next branch

The `next` branch is the development branch, to accumulate changes before releasing an version

## Code Styles

### Interface & Type & Enum names

If the interface/type/enum is specially for some *file / class* (example: `MongoReplSet`), then the name should include the name plus what it is for (example: `MongoReplSetOptions`)
If the type/enum is specially for some *property* then the name should include the property (example: `MongoReplSetStateEnum`)
If the interface/type/enum is an "standalone" then it should be named appropriately (example: `StorageEninge` / `DownloadProgress`)

### File Names

Source file names should be `PascalCase` if the main export is an class (example: `MongoBinary`, and not `Mongo-Binary`)
Source file names should be `camelCase` if there is no "definitive main export" (example: `resolveConfig` & `utils`)

## Documentation

If being new to markdown / docusaurus / Infima styling, look at the following sources:

* [Markdown Basics](https://guides.github.com/features/mastering-markdown/)
* [Docusaurus](https://v2.docusaurus.io/docs/)
* [Infima](https://facebookincubator.github.io/infima/) (is currently not up, needs to be run locally)

There is also an File in this project to view basic elements in the projects styles: [Test Page Source](../docs/test.md) [Test Page Website]() <!--TODO: replace with actual website-->
