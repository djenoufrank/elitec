# Elitec — site et API

Projet composé d'un site React et d'une API FastAPI. Le site affiche les pages d'Elitec et communique avec l'API pour les contacts, le calcul de devis, le portail client et le blog administrable.

## Structure

```text
frontend/       Site React, styles et appels aux services API
backend/        API FastAPI, authentification et accès MongoDB
docs/           Architecture et décisions utiles pour comprendre le code
```

Pour suivre une requête et comprendre les responsabilités de chaque dossier, lire [docs/architecture.md](docs/architecture.md).

## Prérequis Windows

- **Node.js LTS 20 ou plus récent** pour React. Vérifier avec `node --version`.
- **Yarn Classic 1.22.x** pour les dépendances React. Vérifier avec `yarn --version`.
- **Python 3.10 ou plus récent** pour l'API. Vérifier avec `py --version`.
- **MongoDB Community Server** démarré localement, ou une URL MongoDB distante configurée dans `backend/.env`.

XAMPP n'est pas nécessaire : il sert surtout aux projets Apache/PHP/MySQL, alors que ce projet utilise React, FastAPI et MongoDB.

## Premier démarrage

Les commandes ci-dessous sont à lancer dans **PowerShell** depuis la racine du projet. Il faut garder les deux terminaux ouverts pendant le développement : l'un pour l'API, l'autre pour React.

1. Installer Node.js depuis [nodejs.org](https://nodejs.org/en/download/) si `node --version` indique une version inférieure à 20. Yarn Classic est déjà installé sur la machine de développement actuelle ; sinon, après Node.js, l'installer avec `npm install --global yarn` et vérifier `yarn --version`.
2. Installer Python depuis [python.org](https://www.python.org/downloads/windows/) si `py --version` échoue ou indique une version inférieure à 3.10.
3. Installer MongoDB Community Server depuis le [guide officiel Windows](https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-windows/), en choisissant l'installation comme service Windows. Ce projet n'a pas besoin de `mongosh` pour fonctionner.
4. Dans l'application **Services** de Windows (`services.msc`), démarrer le service MongoDB s'il n'est pas déjà lancé.
5. Les fichiers `backend/.env` et `frontend/.env` existent déjà dans cette copie. Les garder tels quels. Dans `backend/.env`, vérifier que `MONGO_URL` pointe vers MongoDB et remplacer les mots de passe de démonstration par des mots de passe locaux que tu choisis. Dans `frontend/.env`, garder `REACT_APP_BACKEND_URL=http://localhost:8000`.
6. Ouvrir le **terminal 1** à la racine du projet, puis préparer l'environnement Python, installer les dépendances et démarrer l'API :

```powershell
Set-Location backend
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn server:app --reload --port 8000
```

   Si tu as une autre version Python 3.x installée, remplace `-3.11` par son numéro, par exemple `-3.12`. Laisser ce terminal ouvert. L'API est disponible à `http://localhost:8000/api/`.
7. Ouvrir un **terminal 2** à la racine du projet, installer les dépendances JavaScript et démarrer React :

```powershell
Set-Location frontend
yarn install
yarn start
```

   Laisser aussi ce terminal ouvert. Le navigateur s'ouvre sur `http://localhost:3000`.

`yarn install` doit pouvoir accéder à Internet la première fois. Si le port 3000 est déjà occupé, React propose d'en choisir un autre.

## Build de production

Depuis `frontend` :

```powershell
yarn build
```

Le résultat est créé dans `frontend/build`. Le build seul ne démarre pas l'API et ne publie pas le site sur Internet.

## Lancer les tests API de développement

Depuis `backend`, installer aussi `requirements-dev.txt`, définir `BACKEND_URL`, puis exécuter `pytest`.

Pour lancer les tests API de développement, installer également `requirements-dev.txt`, définir les variables du backend et `BACKEND_URL`, puis exécuter `pytest`.

## Configuration

Ne jamais committer les vrais fichiers `.env`. Les exemples contiennent uniquement des valeurs fictives ; les secrets et accès MongoDB doivent rester privés.
