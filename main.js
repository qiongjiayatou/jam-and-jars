Vue.component('jars', {
    template: `
        <form @submit.prevent="addJar">
            <h3>Add Jar</h3>
            <p v-if="error" class="error">{{ error }}</p>

            <input v-model="jar.name" type="text" placeholder="Jar Name">
            <input v-model="jar.volume" type="text" placeholder="Jar Volume">
            <button>Add</button>
        </form>
    `,
    data() {
        return {
            jar: {
                name: '',
                volume: '',
            },
            error: null
        }
    },
    methods: {
        addJar() {
            if (!this.jar.name || !this.jar.volume) {
                this.error = 'Please, fill all field!'
                return;
            } else if (isNaN(this.jar.volume)) {
                this.error = 'Volume must be a number!'
                return;
            }


            this.$emit('add:jar', this.jar)
            this.jar = {
                name: '',
                volume: '',
            }
            this.error = null
        }
    }
});

Vue.component('jam', {
    template: `
        <form @submit.prevent="addJam">
            
            <h3>Add Jam</h3>
            <p v-if="error" class="error">{{ error }}</p>
            <input v-model="jam.name" type="text" placeholder="Jam Name">
            <input v-model="jam.volume" type="text" placeholder="Jam Volume">
            <button>Add</button>
        </form>
    `,
    data() {
        return {
            jam: {
                name: '',
                volume: '',
            },
            error: null,

        }
    },
    methods: {
        addJam() {

            if (!this.jam.name || !this.jam.volume) {
                this.error = 'Please, fill all field!'
                return;
            } else if (isNaN(this.jam.volume)) {
                this.error = 'Volume must be a number!'
                return;
            }

            this.$emit('add:jam', this.jam)
            this.jam = {
                name: '',
                volume: '',
            }
            this.error = null


        }
    }
});

Vue.component('jam-and-jar', {
    template: `
        <div class="container">

            <div  v-if="emptyJars.length > 0" class="table-container">
                <h3>Empty jars</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Jar Name</th>
                            <th>Jar Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="jar in emptyJars" :key="jar.name">
                            <td>{{ jar.name }}</td>
                            <td>{{ jar.volume }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="form-container">
                <jars @add:jar="addJar"></jars>
            </div>

            <div v-if="readyMadeJams.length > 0" class="table-container">
                <h3>Jams</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Jam Name</th>
                            <th>Jam Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="jam in readyMadeJams" :key="jam.name">
                            <td>{{ jam.name }}</td>
                            <td>{{ jam.volume }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="form-container">
                <jam @add:jam="addJam"></jam>
            </div>
        

            <button @click="matchJamAndJar">Fill Jars</button>

            <div v-if="jarsWithJam.length > 0" class="table-container">
                <h3>Jars with jam</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Jar Name</th>
                            <th>Jar Volume</th>
                            <th>Jam Name</th>
                            <th>Jam Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, key) in jarsWithJam" :key="key">
                            <td>{{ item.jarName }}</td>
                            <td>{{ item.jarVolume }}</td>
                            <td>{{ item.jamName }}</td>
                            <td>{{ item.jamVolume }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,

    data() {
        return {
            emptyJars: [
                // { name: 'jar1', volume: 100 },
                // { name: 'jar2', volume: 50 },
                // { name: 'jar3', volume: 300 },
                // { name: 'jar4', volume: 150 },
                // { name: 'jar5', volume: 320 },
                // { name: 'jar5', volume: 800 },
            ],
            readyMadeJams: [
                // { name: 'straberry jam', volume: 130 },
                // { name: 'peach jam', volume: 300 },
                // { name: 'cherry jam', volume: 10 },
                // { name: 'melon jam', volume: 700 },
                // { name: 'pear jam', volume: 100 },
            ],
            jarsWithJam: [],
        }
    },
    methods: {
        addJar(jar) {
            let newJar = {
                name: jar.name,
                volume: Number(jar.volume)
            }
            this.emptyJars = [...this.emptyJars, newJar]
        },
        addJam(jam) {
            this.readyMadeJams = [...this.readyMadeJams, jam]
        },

        matchJamAndJar() {
            if (this.readyMadeJams.length > 0 && this.emptyJars.length > 0) {

                this.readyMadeJams.forEach(jam => this.fillJars(jam))
            }
        },

        fillJars(jam) {

            let jarVolEqual = this.emptyJars.find(j => j.volume == jam.volume)
            let jarVolGreater = this.emptyJars.find(j => j.volume > jam.volume)

            if (jarVolEqual) {

                this.addFullJarToStorage(jarVolEqual.name, jarVolEqual.volume, jam.name, jam.volume)

                this.unlistEmptyJar(jarVolEqual.name)
                this.unlistJam(jam.name)

            } else if (jarVolGreater) {

                let allJarsVolGreater = this.emptyJars.filter(j => j.volume > jam.volume)
                let jar = this.findSmallest(allJarsVolGreater)

                this.addFullJarToStorage(jar.name, jar.volume, jam.name, jam.volume)

                this.unlistEmptyJar(jar.name)
                this.unlistJam(jam.name)

            } else {

                let jar = this.findGreatest(this.emptyJars)

                let jamRemainingVol = jam.volume - jar.volume
                let jamRemaining = { name: jam.name, volume: jamRemainingVol }

                // console.log('jamRemaining', jamRemainingVol)

                this.addFullJarToStorage(jar.name, jar.volume, jam.name, jar.volume)

                this.unlistEmptyJar(jar.name)
                this.unlistJam(jam.name)


                this.addJam(jamRemaining)
                this.fillJars(jamRemaining)
            }

        },
        addFullJarToStorage(jarName, jarVolume, jamName, jamVolume) {
            this.jarsWithJam = [...this.jarsWithJam, {
                jarName: jarName,
                jarVolume: jarVolume,
                jamName: jamName,
                jamVolume: jamVolume,
            }]
        },
        findGreatest(arr) {
            return arr.sort((a, b) => a.volume < b.volume)[0]
        },
        findSmallest(arr) {
            return arr.sort((a, b) => a.volume > b.volume)[0]
        },
        unlistEmptyJar(jarName) {
            this.emptyJars = this.emptyJars.filter(j => j.name != jarName);
        },
        unlistJam(jamName) {
            this.readyMadeJams = this.readyMadeJams.filter(j => j.name != jamName)

        }



    },

})



new Vue({
    el: '#root'
});