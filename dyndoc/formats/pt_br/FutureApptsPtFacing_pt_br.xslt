<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    exclude-result-prefixes="xsl xs fn">

    <!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/futureapptsptfacing.xslt"/>
    <!-- Uncomment this line to debug <xsl:import href="../FutureApptsPtFacing.xslt"/> -->
    <!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/pt_br/dateformat_pt_br.xslt"/>
    <!-- Uncomment this line to debug <xsl:import href="./dateformat_pt_br.xslt" /> -->
    <!-- Comment out this line to debug --> <xsl:import href="/cernerbasiccontent/formats/pt_br/addressfxn_pt_br.xslt"/>
    <!-- Uncomment this line to debug <xsl:import href="AddressFxn_pt_br.xslt"/> -->

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:param as="xs:string" name="current-locale" select="'pt_br'"/>

    <!-- Default string constants -->
    <xsl:variable name="When" as="xs:string">
        <xsl:value-of select="'Quando:'"/>
    </xsl:variable>

    <xsl:variable name="With" as="xs:string">
        <xsl:value-of select="'Com:'"/>
    </xsl:variable>
    
    <xsl:variable name="Where" as="xs:string">
        <xsl:value-of select="'Onde:'"/>
    </xsl:variable>

    <xsl:variable name="Contact" as="xs:string">
        <xsl:value-of select="'Informa&#231;&#245;es de contato'"/>
    </xsl:variable>

</xsl:stylesheet>
