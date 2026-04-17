import React from 'react';
import Link from 'next/link';

export default function PublicFooter() {
    return (
        <footer id="contato" className="bg-primary-900 text-primary-50 py-16 px-6 lg:px-12 text-center border-t border-primary-800">
            <div className="container mx-auto flex flex-col items-center max-w-4xl space-y-8">
                {/* Logo Central */}
                <img src="/logo.png" alt="Studio Be" className="h-28 w-auto object-contain mb-4 brightness-110" />

                <h3 className="text-2xl font-bold text-white mb-2">Comunidades Intencionais</h3>
                <p className="text-primary-200 text-lg max-w-xl mx-auto font-medium">
                    StudioBe: onde o pertencer é o novo morar.
                </p>

                {/* Bloco de Contatos Rápidos */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8 mb-4 w-full">
                    <a href="mailto:contato@studiobecohousing.com" className="flex items-center gap-3 bg-primary-800 hover:bg-secondary-600 transition-colors px-6 py-4 rounded-xl shadow-sm text-white font-medium w-full max-w-sm justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        contato@studiobecohousing.com
                    </a>

                    <a href="https://wa.me/5511934898990?text=Ol%C3%A1%2C%20Studio%20Be%21%20Gostaria%20de%20saber%20mais." target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-primary-800 hover:bg-green-600 transition-colors px-6 py-4 rounded-xl shadow-sm text-white font-medium w-full max-w-sm justify-center">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.927 3.151.927 3.181 0 5.767-2.586 5.767-5.766 0-3.18-2.586-5.769-5.769-5.769zM12.031 15.939c-1.127 0-1.924-.343-2.613-.75l-.187-.111-1.29.339.345-1.259-.122-.194c-.45-.718-.737-1.503-.736-2.432 0-2.316 1.885-4.201 4.203-4.201 2.316 0 4.201 1.885 4.201 4.201 0 2.315-1.885 4.207-4.201 4.207z" />
                            <path d="M14.498 12.871c-.135-.068-.801-.395-.925-.44-.124-.045-.214-.068-.305.068-.09.135-.35.44-.429.53-.079.09-.158.101-.293.033-.135-.068-.571-.21-1.087-.671-.401-.358-.673-.801-.752-.936-.079-.135-.008-.209.059-.276.063-.063.135-.158.203-.236.068-.079.09-.135.135-.225.045-.09.023-.169-.011-.236-.034-.068-.304-.734-.416-1.006-.11-.264-.221-.228-.305-.232-.079-.004-.169-.004-.26-.004s-.236.034-.36.169c-.124.135-.473.462-.473 1.127 0 .664.484 1.307.552 1.398.068.09 1.137 1.8 2.75 2.454.673.272 1.198.435 1.609.557.676.2 1.291.171 1.777.104.542-.075 1.666-.681 1.897-1.338.231-.658.231-1.222.163-1.338-.068-.117-.248-.184-.383-.252z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.745.448 3.385 1.228 4.821L2 22l5.356-1.168A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.423c-1.488 0-2.894-.383-4.129-1.045l-.296-.159-3.078.672.684-2.951-.174-.301A8.428 8.428 0 013.577 12c0-4.646 3.777-8.423 8.423-8.423 4.646 0 8.423 3.777 8.423 8.423 0 4.646-3.777 8.423-8.423 8.423z" />
                        </svg>
                        (11) 93489 8990
                    </a>
                </div>

                {/* Link Prestadores */}
                <div className="pt-4 pb-2 w-full text-center">
                    <Link href="/registro-parceiro" className="text-secondary-400 hover:text-white underline decoration-secondary-400/30 hover:decoration-white transition-colors text-sm font-medium">
                        Você é prestador de serviços ou comerciante local? Cadastre-se como Parceiro Studio Be.
                    </Link>
                </div>

                <div className="pt-8 border-t border-primary-800 w-full text-center">
                    <p className="opacity-70">&copy; {new Date().getFullYear()} Studio Be - Soluções em Cohousing. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
