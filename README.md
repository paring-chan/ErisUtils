# Eris Utils

eris 에서 사용 가능한 유틸리티들을 모아놓은 라이브러리 입니다.

#### 설치

```shell script
# NPM
npm install @chinobot/eris-utils

# YARN
yarn add @chinobot/eris-utils
```

#### 설정

Typescript/ES6
```ts
import {ErisUtilClient} from '@chinobot/eris-utils'

const bot = new ErisUtilClient('token', {
    listener: {
        dir: path.join(__dirname, 'listeners'),
        watch: true
    },
    initialEvents: {
        log: (msg: string) => console.log(`[LOG] ${msg}`)
    }
})
bot.connect()
```

Javascript
```js
const {ErisUtilClient} = require('@chinobot/eris-utils')

const bot = new ErisUtilClient('token', {
    listener: {
        dir: path.join(__dirname, 'listeners'),
        watch: true
    },
    initialEvents: {
        log: (msg: string) => console.log(`[LOG] ${msg}`)
    }
})

bot.connect()
```

### 리스너 예시(ready)

Typescript
```ts
import {Command, ErisUtilClient} from '@chinobot/eris-utils'

export default class Ready extends Command {
    constructor(client: ErisUtilClient) {
        super(client, 'client', 'ready');
    }

    execute() {
        console.log(`Logged in as ${this.bot.client.user.username}#${this.bot.client.user.discriminator}`)
    }
}
```

Javascript
```js
const {Command, ErisUtilClient} = require('@chinobot/eris-utils')

export default class Ready extends Command {
    constructor(client: ErisUtilClient) {
        super(client, 'client', 'ready');
    }

    execute() {
        console.log(`Logged in as ${this.bot.client.user.username}#${this.bot.client.user.discriminator}`)
    }
}
```