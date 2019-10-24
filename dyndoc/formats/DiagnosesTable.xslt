<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:dd="DynamicDocumentation"
    xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
    exclude-result-prefixes="xsl xs fn cdocfx n dd xr-date-formatter">

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
    <!--Uncomment this line to debug <xsl:include href="commonfxn.xslt" />-->

    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/dxcommonfxn.xslt" />
    <!--Uncomment this line to debug <xsl:include href="dxcommonfxn.xslt" />-->
    
    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/tablecommon.xslt" />
    <!--Uncomment this line to debug <xsl:include href="tablecommon.xslt" />-->

    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/emrinfocommon.xslt" />
    <!--Uncomment this line to debug <xsl:include href="emrinfocommon.xslt" />-->

    
    <xsl:variable name="diagnosisHeading" as="xs:string" select="'Diagnosis'"/>
    <xsl:variable name="typeHeading" as="xs:string" select="'Type'"/>
    <xsl:variable name="diagnosisDateHeading" as="xs:string" select="'Diagnosis Date'"/>
    <xsl:variable name="qualifierHeading" as="xs:string" select="'Qualifier'"/>
    <xsl:variable name="clinicalServiceHeading" as="xs:string" select="'Clinical Service'"/>
    <xsl:variable name="sourceHeading" as="xs:string" select="'Source'"/>
    <xsl:variable name="commentHeading" as="xs:string" select="'Comments'"/>

    <xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>

    <xsl:template match="/">
        <xsl:if test="n:report/n:clinical-data/n:diagnosis-data/n:clinical-diagnosis[@is-active=true()]">

            <xsl:call-template name="emitTableStart">
                <xsl:with-param name="retainRowsInPlainText" select="true()"/>
            </xsl:call-template>

            <xsl:call-template name="emitHeadingStart">
                <xsl:with-param name="repeatHeadingOnPrintedPages" select="true()"/>
            </xsl:call-template>

            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$diagnosisHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$typeHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$diagnosisDateHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$qualifierHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$clinicalServiceHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$sourceHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$commentHeading"/></xsl:call-template>

            <xsl:call-template name="emitHeadingEnd"/>

            <tbody>

            <xsl:call-template name="emitDiagnosesRows"/>

            </tbody>

            <xsl:call-template name="emitTableEnd"/>
            <xsl:value-of disable-output-escaping="yes" select="$newLine"/>

        </xsl:if>
    </xsl:template>
    
    <xsl:template name="emitDiagnosesRows">
    
        <xsl:for-each select="n:report/n:clinical-data/n:diagnosis-data/n:clinical-diagnosis[@is-active=true()]">
            <xsl:sort select="@annotated-display"/>
            
            <tr class="ddemrcontentitem ddremovable" style="page-break-inside: avoid;" dd:btnfloatingstyle="top-right">
                <xsl:if test="@id">
                    <xsl:attribute name="dd:entityid">
                        <xsl:value-of select="@id"/>
                    </xsl:attribute>
                </xsl:if>
                <xsl:attribute name="dd:contenttype">
                    <xsl:text>DIAGNOSES</xsl:text>
                </xsl:attribute>

                <!--Emit diagnoses display-->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:call-template name="emitEmrInfo">
                    <xsl:with-param name="InfoType" select="'DX_DISP_RENDER'"/>
                    <xsl:with-param name="Content" select="cdocfx:getDxDisplay(current())"/>
                </xsl:call-template>
                <xsl:call-template name="emitTableCellEnd"/>

                <!--Emit diagnoses type-->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="@type-code">
                    <xsl:value-of select="cdocfx:getCodeDisplayByID(@type-code)"/>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!--Emit diagnosis date -->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="n:diagnosis-dt-tm">
                    <xsl:value-of select="cdocfx:getFormattedDateTime(n:diagnosis-dt-tm, $DATE_ONLY_SEQUENCE)"/>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!--Emit diagnosis qualifier-->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="@qualifier-code">
                    <xsl:call-template name="emitEmrInfo">
                        <xsl:with-param name="InfoType" select="'DX_QUAL'"/>
                        <xsl:with-param name="Content" select="cdocfx:getCodeDisplayByID(@qualifier-code)"/>
                    </xsl:call-template>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!--Emit clinical service-->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="@clinical-service-code">
                    <xsl:value-of select="cdocfx:getCodeDisplayByID(@clinical-service-code)"/>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!--Emit source-->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="@classification-code">
                    <xsl:value-of select="cdocfx:getCodeDisplayByID(@classification-code)"/>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!--Emit diagnoses comment-->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="n:comment != ''">
                    <xsl:call-template name="emitEmrInfo">
                        <xsl:with-param name="InfoType" select="'DX_COMMENT'"/>
                        <xsl:with-param name="Content" select="n:comment"/>
                    </xsl:call-template>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>
            </tr>
        </xsl:for-each>
    </xsl:template>

</xsl:stylesheet>