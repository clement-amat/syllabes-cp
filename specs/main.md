On va construire une application web React qui servira de support
à un enseignant de classe de CP pour l'apprentissage des syllabes.

L'idée globale consiste à projeter des syllabes, à partir de sons
que les élèves ont déjà travaillés. Il doivent ensuite prononcer ces
syllabes oralement, et l'enseignant valide, et peut passer à la
suivante.

# Support

Cette application sera projetée sur rétro projecteur en classe

# Séquence d'une utilisation type

## Préparation de la séance par l'enseignant

L'enseignant se rend sur le site, puis peut créer une nouvelle séance.
Il peut aussi reprendre une séance existante qu'il a précédemment créé.

### Création d'une séance

Il s'agit ici de configurer les sons déjà vus par les élèves qui serviront
de base pour que le système puisse générer les syllabes à projeter ensuite.
On fait une interface simple, avec possibilités d'avoir une barre de recherche.

On doit pouvoir configurer une nombre maximal de syllabes à générer

### Enregistrement

La séance une fois créée est sauvegardée, via local storage (ne doit pas être
bloquant, car je ne sais pas si les PC de l'EN autorise cela)

## Déroulé de la séquence

Las syllabes sont affichés en grand sur l'écran.
L'enseignant peut passer à la suivante via des boutons, ou bien revenir en arrière.

A la fin, on redirige sur l'écran d'accueil.
