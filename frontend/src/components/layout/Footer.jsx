import { footerLinks } from '../../data/navigation'

function Footer() {
  return (
    <footer className="app-footer w-100">
      <div className="w-100 px-lg py-xl d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-lg container-fluid">
        <div className="d-flex flex-column gap-xs">
          <span className="font-headline text-on-surface fw-semibold body-md">
            Laboratório Nacional de Referência Científica
          </span>
          <span className="label-md text-on-surface-variant">
            Ministério da Ciência, Tecnologia e Inovações — Governo Federal
          </span>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-lg label-md text-on-surface-variant">
          {footerLinks.map((link) => (
            <a key={link.path} href={link.href} className="text-on-surface-variant text-decoration-none">
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="app-footer-bar w-100 py-sm px-lg">
        <p className="text-center label-md text-on-surface-variant mb-0" style={{ fontSize: '0.75rem' }}>
          © 2024 Laboratório Nacional - Governo Federal do Brasil. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}

export default Footer
