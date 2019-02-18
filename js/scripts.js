(function () {

    const NOTACORTE = 5;

    class App {
        constructor() {
            this.aulas = ["a", "b", "c"];
            this.notas = [
                {
                    aula: "a",
                    nombre: "Luis",
                    apellido: "González",
                    nota: 6.23
                },
                {
                    aula: "a",
                    nombre: "Esteban",
                    apellido: "Prieto",
                    nota: 3.5
                },
                {
                    aula: "b",
                    nombre: "Patricia",
                    apellido: "Nieto",
                    nota: 3
                },
                {
                    aula: "b",
                    nombre: "Joaquín",
                    apellido: "Calero",
                    nota: 4
                },
                {
                    aula: "c",
                    nombre: "Dolores",
                    apellido: "Moreno",
                    nota: 2
                },
                {
                    aula: "c",
                    nombre: "Marta",
                    apellido: "Suárez",
                    nota: 9
                }
            ];

            this.notasAulas = this.getNotasAulas();
            this.pintaNotasAulas();
            this.pintaTotalesAulas();
            this.pintaTotales();
        }

        getNotasAula(aula) {
            return this.notas.filter(nota => nota.aula === aula);
        }

        getNotasAulas() {
            let notasAulas = {}
            for (let aula of this.aulas) {
                notasAulas[aula] = this.getNotasAula(aula);
            }
            return notasAulas;
        }

        pintaNotasAula(aula) {
            let bloqueAulaElem = document.querySelector(`[data-aula="${aula}"]`);
            let tablaNotasElem = bloqueAulaElem.querySelector(".lista-notas tbody");
            let notaBaseElem = tablaNotasElem.querySelector(".nota-base");
            let notasElem = tablaNotasElem.querySelectorAll("tr");
            for (let notaElem of notasElem) {
                notaElem.remove();
            }
            for (let nota of this.notasAulas[aula]) {
                let notaElem = notaBaseElem.cloneNode(true);
                tablaNotasElem.appendChild(notaElem);
                notaElem.querySelector(".alumno-nombre").textContent = nota.nombre;
                notaElem.querySelector(".alumno-apellido").textContent = nota.apellido;
                notaElem.querySelector(".alumno-nota").textContent = nota.nota;
                if (this.isAprobado(nota.nota)) {
                    notaElem.classList.add("table-success");
                } else {
                    notaElem.classList.add("table-danger");
                }
            }
        }

        pintaNotasAulas() {
            for (let aula of this.aulas) {
                this.pintaNotasAula(aula);
            }
        }

        pintaTotalesAula(aula) {
            let bloqueAulaElem = document.querySelector(`[data-aula="${aula}"]`);
            let totalesAulaElem = bloqueAulaElem.querySelector(".totales");
            let notaMediaElem = totalesAulaElem.querySelector(".nota-media");
            let notaMaximaElem = totalesAulaElem.querySelector(".nota-maxima");
            let notaMediaStatusElem = totalesAulaElem.querySelector(".nota-media-status");
            let notaMaximaStatusElem = totalesAulaElem.querySelector(".nota-maxima-status");
            let notaMedia = this.getMediaAula(aula);
            notaMediaElem.textContent = notaMedia;
            let notaMaxima = this.getNotaMaximaAula(aula);
            notaMaximaElem.textContent = notaMaxima;
            if (this.isAprobado(notaMedia)) {
                notaMediaStatusElem.classList.add("fa-smile", "icono-ok");
            } else {
                notaMediaStatusElem.classList.add("fa-frown", "icono-no-ok");
            }
            if (this.isAprobado(notaMaxima)) {
                notaMaximaStatusElem.classList.add("fa-smile", "icono-ok");
            } else {
                notaMaximaStatusElem.classList.add("fa-frown", "icono-no-ok");
            }
            let aprobadosElem = totalesAulaElem.querySelector(".aprobados");
            let suspensosElem = totalesAulaElem.querySelector(".suspensos");
            let nAprobados = this.getAprobadosAula(aula);
            let porcentajeAprobados = (nAprobados / this.notasAulas[aula].length) * 100;
            let nSuspensos = this.notasAulas[aula].length - nAprobados;
            let porcentajeSuspensos = (nSuspensos / this.notasAulas[aula].length) * 100;
            aprobadosElem.textContent = `${nAprobados} (${porcentajeAprobados}%)`;
            suspensosElem.textContent = `${nSuspensos} (${porcentajeSuspensos}%)`;
        }

        pintaTotalesAulas() {
            for (let aula of this.aulas) {
                this.pintaTotalesAula(aula);
            }
        }

        isAprobado(nota) {
            return nota >= NOTACORTE;
        }

        getMediaAula(aula) {
            let notaMedia = this.notasAulas[aula].reduce((acum, nota) => acum + nota.nota, 0) / this.notasAulas[aula].length;
            return notaMedia.toFixed(2);
        }

        getNotaMaximaAula(aula) {
            return this.notasAulas[aula].reduce((acum, nota) => nota.nota > acum ? nota.nota : acum, 0);
        }

        getAprobadosAula(aula) {
            return this.notasAulas[aula].filter(nota => nota.nota >= NOTACORTE).length;
        }

        pintaTotales() {
            let totalesElem = document.querySelector(".totales-globales");
            let notaMediaElem = totalesElem.querySelector(".nota-media");
            let notaMaximaElem = totalesElem.querySelector(".nota-maxima");
            let aprobadosElem = totalesElem.querySelector(".aprobados");
            let suspensosElem = totalesElem.querySelector(".suspensos");
            notaMediaElem.textContent = this.getMediaTotal().toFixed(2);
            notaMaximaElem.textContent = this.getNotaMaximaTotal();
            let nAprobados = this.getAprobadosTotal();
            let porcentajeAprobados = (nAprobados / this.notas.length) * 100;
            aprobadosElem.textContent = `${nAprobados} (${porcentajeAprobados.toFixed(2)}%)`;
            let nSuspensos = this.notas.length - nAprobados;
            let porcentajeSuspensos = (nSuspensos / this.notas.length) * 100;
            suspensosElem.textContent = `${nSuspensos} (${porcentajeSuspensos.toFixed(2)}%)`;
        }

        getMediaTotal() {
            return this.notas.reduce((acum, nota) => acum + nota.nota, 0) / this.notas.length;
        }

        getNotaMaximaTotal() {
            return this.notas.reduce((acum, nota) => nota.nota > acum ? nota.nota : acum, 0);
        }

        getAprobadosTotal() {
            return this.notas.filter(nota => nota.nota >= NOTACORTE).length;
        }

    }

    new App();

})()