# Pourquoi une Base de Données PostgreSQL?


Dans le cadre du développement de notre application, le choix du Système de Gestion de Bases de Données (**SGBD**) est une décision cruciale qui influencera la performance, la scalabilité, et la maintenance de notre projet. Il existe de nombreux SGBD disponibles, chacun offrant des avantages et des inconvénients spécifiques.

Ce comparatif se concentre sur trois des SGBD les plus utilisés : PostgreSQL, MySQL et SQLite et MongoDB.
Cette analyse nous permettra de comprendre les forces et les faiblesses de chaque SGBD afin de prendre une décision éclairée pour notre projet.

| Catégorie              | 🥇 PostgreSQL   | 🥈 MySQL     | 🥉 SQLite     | 🏅 MongoDB      |
| ---------------------- | --------------- | ------------ | ------------- | --------------- |
| Scalabilité            | ⭐️⭐️⭐️⭐️    | ⭐️⭐️⭐️    | ⭐️⭐️        | ⭐️⭐️⭐️⭐️    |
| Payant                 | Gratuit         | Gratuit      | Gratuit       | Gratuit         |
| Rapidité               | ⭐️⭐️⭐️       | ⭐️⭐️⭐️⭐️ | ⭐️⭐️⭐️     | ⭐️⭐️⭐️⭐️⭐️ |
| Popularité             | ⭐️⭐️⭐️⭐️    | ⭐️⭐️⭐️⭐️ | ⭐️⭐️        | ⭐️⭐️⭐️⭐️⭐️ |
| Maturité               | ⭐️⭐️⭐️⭐️⭐️ | ⭐️⭐️⭐️⭐️ | ⭐️⭐️⭐️⭐️  | ⭐️⭐️⭐️⭐️    |
| Licence Open Source    | PostgreSQL      | GPL          | Public Domain | SSPL            |
| Communauté GitHub      | ⭐️⭐️⭐️       | ⭐️⭐️⭐️    | ⭐️⭐️        | ⭐️⭐️⭐️⭐️    |
| Contributeurs          | Très nombreux   | Nombreux     | Peu           | Nombreux        |
| Documentation          | ⭐️⭐️⭐️⭐️⭐️ | ⭐️⭐️⭐️⭐️ | ⭐️⭐️⭐️     | ⭐️⭐️⭐️⭐️    |
| Dépendances/librairies | ⭐️⭐️⭐️⭐️⭐️ | ⭐️⭐️⭐️⭐️ | ⭐️⭐️        | ⭐️⭐️⭐️⭐️⭐️ |

<details>
<summary>Comparatif détaillé SGBD PostgreSQL Vs MySQL Vs SQLite Vs MongoDB</summary>

1. Scalabilité :

   - **PostgreSQL** : ⭐️⭐️⭐️⭐️ - PostgreSQL est bien connu pour sa capacité à évoluer pour des applications à grande échelle.
   - **MySQL** : ⭐️⭐️⭐️ - MySQL peut évoluer, mais il est souvent considéré comme moins performant pour les très grandes échelles comparé à PostgreSQL.
   - **SQLite** : ⭐️⭐️ - SQLite est conçu pour des applications légères et ne convient pas aux grands projets nécessitant une grande scalabilité.
   - **MongoDB** : ⭐️⭐️⭐️⭐️ - Conçu pour être facilement scalable horizontalement, idéal pour les grands volumes de données.

2. Payant :

   - Toutes les bases de données mentionnées sont gratuites.

3. Rapidité :

   - **PostgreSQL** : ⭐️⭐️⭐️ - PostgreSQL est performant mais parfois un peu plus lent en comparaison avec MySQL dans certains scénarios.
   - **MySQL** : ⭐️⭐️⭐️⭐️ - MySQL est souvent reconnu pour sa rapidité et sa performance.
   - **SQLite** : ⭐️⭐️⭐️ - SQLite est rapide pour les petites applications et les fichiers locaux, mais moins performant à grande échelle.
   - **MongoDB** : ⭐️⭐️⭐️⭐️⭐️ - Très performant pour les opérations de lecture/écriture de grands volumes de données non structurées.

4. Popularité :

   - **PostgreSQL** : ⭐️⭐️⭐️⭐️ - Très populaire, surtout dans les environnements professionnels.
   - **MySQL** : ⭐️⭐️⭐️⭐️ - Très populaire, notamment pour les applications web.
   - **SQLite** : ⭐️⭐️ - Populaire pour les applications légères et mobiles, mais moins connu que les deux autres.
   - **MongoDB** : ⭐️⭐️⭐️⭐️⭐️ - Extrêmement populaire dans les environnements NoSQL et les applications modernes.

5. Maturité :

   - **PostgreSQL** : ⭐️⭐️⭐️⭐️⭐️ - Très mature avec une longue histoire de développement.
   - **MySQL** : ⭐️⭐️⭐️⭐️ - Très mature également, mais légèrement derrière PostgreSQL en termes de fonctionnalités avancées.
   - **SQLite** : ⭐️⭐️⭐️⭐️ - Mature pour ses cas d’utilisation spécifiques, mais limité pour les grandes applications.
   - **MongoDB** : ⭐️⭐️⭐️⭐️ - Assez mature, avec une adoption croissante et des améliorations constantes.

6. Licence Open Source :

   - **PostgreSQL** : PostgreSQL License - Très permissive.
   - **MySQL** : GPL - Licence libre.
   - **SQLite** : Public Domain - Aucune restriction.
   - **MongoDB** : SSPL - Licence Server Side Public License, plus restrictive pour l’utilisation commerciale.

7. Communauté GitHub :

   - **PostgreSQL** : ⭐️⭐️⭐️ - Grande communauté active.
   - **MySQL** : ⭐️⭐️⭐️ - Communauté active.
   - **SQLite** : ⭐️⭐️ - Moins grande communauté comparée aux deux autres.
   - **MongoDB** : ⭐️⭐️⭐️⭐️ - Très grande communauté avec de nombreuses contributions.

8. Contributeurs :

   - **PostgreSQL** : Très nombreux - Grande participation de la communauté.
   - **MySQL** : Nombreux - Grande participation, mais contrôlée par Oracle.
   - **SQLite** : Peu - Développement principalement assuré par un petit groupe de développeurs.
   - **MongoDB** : Nombreux - Active participation de la communauté et de l’entreprise MongoDB, Inc.

9. Documentation :

   - **PostgreSQL** : ⭐️⭐️⭐️⭐️⭐️ - Documentation exhaustive et bien maintenue.
   - **MySQL** : ⭐️⭐️⭐️⭐️ - Bonne documentation.
   - **SQLite** : ⭐️⭐️⭐️ - Documentation adéquate mais moins détaillée que les deux autres.
   - **MongoDB** : ⭐️⭐️⭐️⭐️ - Documentation complète et bien maintenue, avec de nombreux tutoriels.

10. Dépendances/librairies :

- **PostgreSQL** : ⭐️⭐️⭐️⭐️⭐️ - Nombreuses bibliothèques et extensions disponibles.
- **MySQL** : ⭐️⭐️⭐️⭐️ - Nombreuses bibliothèques et extensions disponibles.
- **SQLite** : ⭐️⭐️ - Moins de dépendances et de bibliothèques comparé aux deux autres.
- **MongoDB** : ⭐️⭐️⭐️⭐️⭐️ - Large écosystème de bibliothèques et d’outils disponibles.
</details>
<br>

> **En conclusion** PostgreSQL est un excellent choix pour le développement de notre application, non seulement en raison de sa robustesse et de sa scalabilité pour notre application, mais aussi grâce à sa maturité et à sa communauté active.
>
> >
>
> - PostgreSQL est un excellent choix pour le développement de notre application en raison de sa robustesse, de sa scalabilité, de sa maturité et de sa communauté active.
> - L’utilisation de PostgreSQL enrichit notre projet en offrant une gestion avancée des données et une forte conformité aux normes SQL, ce qui est crucial pour notre application nécessitant une base de données fiable et performante.
> - La combinaison de PostgreSQL avec ses nombreuses extensions et bibliothèques offre une base solide pour une maintenance aisée et une évolutivité efficace, tout en profitant d’une documentation exhaustive et bien maintenue, ainsi que d’une communauté de contributeurs très active.
> - Le choix de PostgreSQL garantit également une licence open source très permissive, permettant une intégration flexible et une adaptation aux besoins spécifiques de notre projet.

[🔙 Retour à la Table des matières](../README.md)
