if (typeof i18n === "undefined") {
    var i18n = {};
}

i18n.oncology = {};
i18n.oncology.fn = {};

/* as in, "the bodily origin or place (the route) where the temperature was taken" */
i18n.oncology.fn.ROUTE = "Via";
i18n.oncology.fn.CLINICAL_NAME = "Nome clínico";
i18n.oncology.fn.CLINICAL_DISPLAY_INFO = "Informações de exibição clínica";
i18n.oncology.fn.NO_RESULTS = "Não existem resultados correspondentes disponíveis para o intervalo de tempo selecionado.";
i18n.oncology.fn.BAD_RANGE = "Intervalo de datas não reconhecido: {0}. Selecione novamente.";
i18n.oncology.fn.CUSTOM = "Agora você está preparado para criar um código personalizado.";
i18n.oncology.fn.CUSTOM_JS = "Para a parte dinâmica do seu código, crie um arquivo denominado <b>com.cerner.oncology.fn.client.js</b> no subdiretório .\\js do projeto atual. Defina uma função denominada <b>com.cerner.oncology.fn.createCustomSection(daysBack)</b> no novo arquivo. Esta função é seu ponto de entrada do arquivo de origem MPage principal e será chamado quando o resto da página for carregado.";
i18n.oncology.fn.CUSTOM_CSS = "Se quiser usar uma folha de estilo da sua seção do MPage, crie um arquivo denominado <b>onc_fn_client_css.css</b> no subdiretório .\\css do projeto atual do  MPage.";
i18n.oncology.fn.CUSTOM_DIR = "O diretório do projeto atual é definido como";
i18n.oncology.fn.CUSTOM_UCERN = "As informações adicionais relativas ao desenvolvimento personalizado de conteúdo para esta página se encontra disponível no uCern em";
i18n.oncology.fn.CUSTOM_GOOD_LUCK = "Boa sorte!";
i18n.oncology.fn.CUSTOM_ERROR = "A chamada da API do código personalizado está lançando um erro.\\n\\nConfira se você criou um arquivo de origem denominado com.cerner.oncology.fn.client.js e uma função denominada com.cerner.oncology.fn.createCustomSection(daysBack) para seu ponto de entrada.\\n\\nClique em OK par ver a mensagem de erro.";