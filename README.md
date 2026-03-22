<div align="center">
  <h1 align="center">MY PORTFOLIO</h1>
  <p align="center">
    A customizable, minimal, and highly interactive developer portfolio website built using native web technologies with a modern cybernetic aesthetic.
  </p>
</div>

<p align="center">
  <a href="#table-of-contents"><strong>Explore the docs »</strong></a>
  <br />
  <br />
  <a href="https://rsajaykumar.github.io/Portfolio">View Demo</a>
  ·
  <a href="https://github.com/rsajaykumar/Portfolio/issues">Report Bug</a>
  ·
  <a href="https://github.com/rsajaykumar/Portfolio/issues">Request Feature</a>
</p>

## Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Customization](#customization)
  - [Changing Content](#changing-content)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Connect With Me](#connect-with-me)

## About The Project

This repository contains the source code for a highly dynamic, responsive portfolio website. It was designed from scratch to serve as a hub for active deployments, coding competencies, and system logs.

Instead of relying on heavy frameworks, this project embraces the raw power of HTML5, CSS3, and Vanilla JavaScript to deliver blazing-fast performance and seamless animations (including a live 2D canvas network background).

## Features

- **Responsive Design**: Flawlessly adapts to various screen sizes and devices.
- **Dynamic GitHub Integration**: Automatically fetches and prioritizes your live GitHub repositories (excluding specific repos as needed).
- **Interactive UI**: Includes a custom live canvas background particle system, click-sparks, and CSS keyframe animations.
- **Terminal Simulator**: A fully animated, typing terminal interface to showcase your skills or background in a unique way.
- **Encrypted Contact Nodes**: A gamified decryption sequence for revealing contact info.
- **Minimalistic & Easily Customizable**: Clean semantic HTML and CSS structure making it easy to adapt for any developer.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Since this project uses native web technologies, the only requirement is a web browser. However, to run it locally with the best results:
* Python 3.x (Optional: for running a local live server)
* Git

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/rsajaykumar/Portfolio.git
   ```
2. Navigate to the project directory
   ```sh
   cd Portfolio
   ```
3. Open the `index.html` file in your preferred browser, or run a local server:
   ```sh
   python -m http.server 8000
   ```
   *Then visit `http://localhost:8000`*

## Usage

This project acts as your personal portfolio on the internet. You can host it on GitHub Pages, Netlify, or Vercel natively. The dynamic GitHub engine in `js/scripts.js` will automatically pull in your latest data.

## Customization

### Changing Content

All main content is located in the `index.html` file.
* **Header & Hero**: Update the SVG logo and the `hero-title` span tags.
* **GitHub Username**: Open `js/scripts.js` and change `const GITHUB_USERNAME = 'rsajaykumar';` to your own username to instantly pull your public repositories.
* **Colors**: Open `css/styles.css` and navigate to the `:root` pseudo-class. You can easily tweak `--accent-cyan`, `--accent-yellow`, and `--accent-green` to change the entire theme!

## Deployment

The repository includes a `netlify.toml` for zero-configuration, instant deployments to Netlify. 

1. Link this repository to your Netlify account.
2. Netlify will auto-deploy the site upon every push to the `master` branch.
3. For local pushing convenience, simply run the included `push.bat` (Windows).

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Connect With Me

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rsajaykumar)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ajay-kumar-r-s/)
