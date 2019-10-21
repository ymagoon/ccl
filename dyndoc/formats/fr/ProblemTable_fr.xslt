<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions">

	<!-- Comment this line to debug -->	<xsl:import href="/cernerbasiccontent/formats/problemtable.xslt"/>
	<!-- Uncomment this line to debug  <xsl:import href="../problemtable.xslt" /> -->
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/fr/dateformat_fr.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_fr.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'fr'"/>

	<!-- Strings defined for ProblemTable.xslt, String values defined here override the default values defined in ProblemTable.xslt -->
	<xsl:variable name="conditionHeading" as="xs:string" select="'Maladie'"/>
	<xsl:variable name="onsetDateHeading" as="xs:string" select="'Date de d&#233;but'"/>
	<xsl:variable name="statusHeading" as="xs:string" select="'Statut'"/>
	<xsl:variable name="sourceHeading" as="xs:string" select="'Source'"/>
	<xsl:variable name="commentHeading" as="xs:string" select="'Commentaires'"/>

</xsl:stylesheet>