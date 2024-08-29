## 10.1. Gestion des routes, Authentification

### 1. Gestion des Routes et AuthController 

Le `AuthController` est associé à des routes spécifiques qui gèrent les requêtes HTTP liées à l’authentification des utilisateurs. Par exemple, la route `/api/login` est mappée à la méthode `login` du `AuthController`. Lorsqu’une requête `POST` est envoyée à cette route, le contrôleur reçoit les données, les valide à l’aide de `Joi`, et appelle les services appropriés pour traiter l’authentification.

### 2. AuthService et Sécurité 

Le `AuthService` est invoqué par le `AuthController` lorsque la route `/api/login` est appelée. Il prend en charge la logique métier pour l’authentification, y compris la vérification des informations d’identification via le hashing des mots de passe avec `bcrypt`.

**Sécurité :**

- **Gestion des Entrées** : Les routes sont protégées en amont par des validations strictes via `Joi` pour s’assurer que seules des données conformes arrivent dans le contrôleur.
- **Hashing des Mots de Passe** : Le `AuthService` assure que les mots de passe sont hachés avant toute comparaison, renforçant ainsi la sécurité des informations sensibles.
- **Gestion des Erreurs** : Les erreurs sont capturées et renvoyées avec des statuts HTTP appropriés, ce qui permet aux routes de gérer proprement les échecs d’authentification.

### 3. Importance des Routes 

Les routes sont essentielles pour diriger les requêtes HTTP vers les bons contrôleurs et services. Elles agissent comme une interface entre les utilisateurs et l’application, permettant aux utilisateurs d’interagir avec le système de manière sécurisée et structurée.

## 10.2. Sécurisation des routes API avec JWT

Nous devons mettre en œuvre un système de sécurisation de nos routes utilisant des tokens JWT pour garantir que seules les requêtes authentifiées peuvent accéder aux ressources protégées.

### 1. Génération et Validation des JWT 

Dans le cadre de la sécurisation des routes de l’application, un token JWT est généré lors de la connexion réussie de l’utilisateur. Cela se fait via une route spécifique `/api/auth/generateToken`, qui est dédiée à cette tâche. Une fois l’authentification validée, un token JWT est généré et renvoyé au client pour être utilisé dans les requêtes futures. Le token contient les informations de l’utilisateur, soit son `username`, son `email` et son `role`. Le token est signé avec une clé secrète (`JWT_SECRET`) pour garantir son intégrité.

### 2. Validation et Sécurisation des Données 

Pour renforcer la sécurité, l’email est sanitisé avant d’être utilisé, et un schéma `Joi` est utilisé pour valider les entrées de l’utilisateur (email et password). Cela empêche les attaques par injection et assure que les données sont conformes avant toute tentative d’authentification.

### 3. Middleware d’Authentification JWT

Pour sécuriser les routes de l’application, un middleware `authenticateToken` est mis en place. Ce middleware vérifie la présence d’un token JWT dans chaque requête entrante. Si le token est valide, l’utilisateur est autorisé à accéder à la ressource protégée ; sinon, l’accès est refusé.

- Recherche le token JWT soit dans l’en-tête `Authorization` (sous la forme d’un Bearer Token), soit dans les cookies.
- Vérifie la validité du token en utilisant la clé secrète (`JWT_SECRET`). Si le token est valide, il décode le contenu et attache les informations de l’utilisateur à l’objet `req` pour un accès ultérieur.
- Gère les erreurs en renvoyant des réponses `401 Unauthorized` ou `403 Forbidden` selon la situation.

### 4. Utilisation du Middleware pour Protéger les Routes

Le middleware `authenticateToken` est appliqué aux routes nécessitant une authentification. Par exemple, une route protégée qui retourne des informations utilisateur ne peut être accédée que par les utilisateurs ayant un token JWT valide.