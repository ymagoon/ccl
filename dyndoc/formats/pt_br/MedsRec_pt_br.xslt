<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/medsrec.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../medsrec.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'pt_br'"/>
	
	<!-- Strings defined for medsrec.xslt, String values defined here override the default values defined in medsrec.xslt -->
	<xsl:variable name="What" as="xs:string">
		<xsl:value-of select="'O qu&#234;'"/>
	</xsl:variable>
	
	<xsl:variable name="HowMuch" as="xs:string">
		<xsl:value-of select="'Quanto'"/>
	</xsl:variable>
	
	<xsl:variable name="How" as="xs:string">
		<xsl:value-of select="'Como'"/>
	</xsl:variable>
	
	<xsl:variable name="When" as="xs:string">
		<xsl:value-of select="'Quando'"/>
	</xsl:variable>
	
	<xsl:variable name="Why" as="xs:string">
		<xsl:value-of select="'Por qu&#234;'"/>
	</xsl:variable>
	
	<xsl:variable name="AsNeeded" as="xs:string">
		<xsl:value-of select="'conforme necess&#225;rio'"/>
	</xsl:variable>
	
	<xsl:variable name="Instructions" as="xs:string">
		<xsl:value-of select="'Instru&#231;&#245;es'"/>
	</xsl:variable>
	
	<xsl:variable name="Duration" as="xs:string">
		<xsl:value-of select="'Dura&#231;&#227;o: '"/>
	</xsl:variable>
	
	<xsl:variable name="Comments" as="xs:string">
		<xsl:value-of select="'Coment&#225;rios'"/>
	</xsl:variable>
	
	<xsl:variable name="Pickup" as="xs:string">
		<xsl:value-of select="'Retirada'"/>
	</xsl:variable>
	
	<xsl:variable name="Refills" as="xs:string">
		<xsl:value-of select="'Reabastecimentos:'"/>
	</xsl:variable>
	
	<xsl:variable name="New" as="xs:string">
		<xsl:value-of select="'Novo'"/>
	</xsl:variable>
	
	<xsl:variable name="Changed" as="xs:string">
		<xsl:value-of select="'Alterado'"/>
	</xsl:variable>
	
	<xsl:variable name="Unchanged" as="xs:string">
		<xsl:value-of select="'N&#227;o alterado'"/>
	</xsl:variable>

	<xsl:variable name="NextLastDose" as="xs:string">
		<xsl:value-of select="'Pr&#243;xima dose'"/>
	</xsl:variable>
	
	<xsl:variable name="StopTaking" as="xs:string">
		<xsl:value-of select="'Parar de tomar'"/>
	</xsl:variable>
	
	<xsl:variable name="ContactPhysician" as="xs:string">
		<xsl:value-of select="'Entre em contato com o m&#233;dico prescritor em caso de d&#250;vidas'"/>
	</xsl:variable>
	
	<xsl:variable name="Connector" as="xs:string">
		<xsl:value-of select="'%s %s'"/>
	</xsl:variable>
	
	<xsl:variable name="PharmacyConnector" as="xs:string">
		<xsl:value-of select="'%s: %s %s'"/>
	</xsl:variable>
	<!-- Displays Frequency followed by PRN. -->
	<!-- Swap placeholders to display PRN followed by Frequency -->
	<xsl:variable name="FreqPRNConnector" as="xs:string">
		<xsl:value-of select="'%1$s conforme necess&#225;rio para %2$s'"/>
	</xsl:variable>
	
	<!-- Used to display either of PRN Reason or PRN Instructions -->
	<xsl:variable name="PRNConnector" as="xs:string">
		<xsl:value-of select="'conforme necess&#225;rio para %1$s'"/>
	</xsl:variable>

	<xsl:variable name="SeeInstructions" as="xs:string">
		<xsl:value-of select="'Consulte as instru&#231;&#245;es'"/>
	</xsl:variable>
	
	<xsl:variable name="Printed" as="xs:string">
		<xsl:value-of select="'Receita impressa'"/>
	</xsl:variable>
	
</xsl:stylesheet>
