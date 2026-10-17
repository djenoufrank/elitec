# Architecture du projet

Le projet est un monorepo : l'interface React et l'API Python sont deux applications distinctes qui communiquent par HTTP/JSON.

## Vue d'ensemble

```text
Navigateur
  └─ React (frontend/src)
      ├─ pages et composants : affichage et interactions
      ├─ lib/auth.jsx : état de session exposé avec le hook useAuth
      └─ services : appels API regroupés par domaine
          └─ ApiClient : URL, JSON, jeton Bearer et erreurs
              └─ HTTP /api
                  └─ FastAPI (backend)
                      ├─ app/api : contrôleurs HTTP par domaine
                      ├─ app/schemas.py : validation et forme des échanges
                      ├─ app/repositories.py : accès aux collections MongoDB
                      ├─ app/database.py : connexion et dépendances partagées
                      └─ auth.py : mots de passe, JWT et autorisations
```

## Frontend React

- `src/pages/` contient les écrans associés aux routes (accueil, contact, blog, portail, administration...).
- `src/components/` contient les éléments réutilisés, notamment le menu et le pied de page. `components/ui/` regroupe les briques visuelles.
- `src/services/` est la frontière entre l'interface et l'API. `AuthService`, `TicketService`, `ContentService` et `CustomerService` regroupent les requêtes de leur domaine.
- `src/services/ApiClient.js` configure Axios une fois : adresse de l'API, en-têtes, jeton enregistré et présentation des erreurs.
- `src/lib/auth.jsx` est le contexte de session et le hook `useAuth`. En React, les composants fonctionnels et les hooks sont la convention ; les services sont des classes simples parce qu'ils regroupent des opérations cohérentes, pas parce que React exige des classes.
- `src/lib/i18n.jsx` gère les textes français/anglais ; `src/lib/data.js` rassemble les constantes éditoriales utilisées par les pages.

Parcours d'une action : `Contact.jsx` → `customerService.sendContactMessage()` → `ApiClient` → `POST /api/contact`.

## Backend FastAPI

- `server.py` conserve le point d'entrée `uvicorn server:app` utilisé auparavant. Il assemble FastAPI, les routeurs et les tâches de démarrage (index et données de démonstration).
- `app/api/` contient les contrôleurs HTTP regroupés par domaine : routes publiques, authentification, tickets, base de connaissances et blog. Ils gèrent les chemins HTTP, les dépendances d'autorisation et les réponses.
- `app/schemas.py` contient les modèles Pydantic des requêtes/réponses : validation des données à la frontière HTTP.
- `app/repositories.py` adapte les collections Motor derrière des dépôts nommés. Les contrôleurs ne dépendent plus directement de Motor.
- `app/database.py` charge la configuration, crée le client MongoDB et expose les dépôts ainsi que les dépendances de session/admin.
- `auth.py` traite les responsabilités de sécurité : hachage/vérification du mot de passe, création/vérification des JWT et contrôles d'accès.

Les contrôleurs portent encore une partie des règles métier et de l'orchestration. Les extraire dans des services applicatifs dédiés sera une évolution utile quand de nouvelles fonctions seront confirmées ; cela évite d'ajouter une couche vide aujourd'hui. L'architecture est inspirée de MVC : pages/composants React pour la vue, routeurs FastAPI pour les contrôleurs, schémas pour les données et dépôts pour la persistance. Le modèle métier est actuellement principalement représenté par les schémas Pydantic et les documents MongoDB.

## Données actuellement persistées

Le backend configure MongoDB. Il utilise des collections pour les utilisateurs, tickets, articles du blog, articles d'aide, demandes de contact et devis calculés. Le fait que l'ancien site Hostinger ait pu être statique reste à vérifier avec sa propriétaire : cette copie contient une API et ne prouve pas à elle seule que toutes ses fonctions étaient utilisées en production.

## Démarrage local

- Frontend : depuis `frontend`, `yarn start` (Node.js 20 ou supérieur est requis par les dépendances verrouillées).
- Backend : depuis `backend`, créer `.env` à partir de `.env.example`, puis lancer `uvicorn server:app --reload`. MongoDB doit être disponible et les variables de sécurité et de démonstration doivent être configurées.
- Build React de production : depuis `frontend`, `yarn build`.

Le frontend et le backend ont leurs dépendances et leurs processus de démarrage séparés. En production, ils pourront être hébergés ensemble ou séparément selon les besoins et le coût ; le choix du fournisseur est hors de ce refactor.
